import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { authService } from "../src/auth/auth.service.js";

const adminToken = authService.generateToken({
  id: "test-admin-id",
  email: "admin@jewelai.com",
  role: "ADMIN",
  name: "Test Admin",
});

const userToken = authService.generateToken({
  id: "test-user-id",
  email: "user@jewelai.com",
  role: "USER",
  name: "Test User",
});

describe("API Endpoints & Health Check", () => {
  it("GET /api/health returns 200 OK with server status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("JEWELAI API");
  });

  it("POST /api/ai-jewelry/generate rejects unauthenticated requests with 401", async () => {
    const res = await request(app)
      .post("/api/ai-jewelry/generate")
      .field("category", "earrings");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("AUTH_REQUIRED");
  });

  it("POST /api/ai-jewelry/generate with admin token tests validation for missing model", async () => {
    const res = await request(app)
      .post("/api/ai-jewelry/generate")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("category", "earrings");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("MODEL_IMAGE_INVALID");
  });

  it("POST /api/ai-jewelry/generate in ai-model mode requires jewelryImage but not modelImage", async () => {
    const res = await request(app)
      .post("/api/ai-jewelry/generate")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("category", "earrings")
      .field("mode", "ai-model");

    // Fails with JEWELRY_IMAGE_INVALID, NOT MODEL_IMAGE_INVALID
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("JEWELRY_IMAGE_INVALID");
  });

  it("GET /api/ai-jewelry/history returns list", async () => {
    const res = await request(app).get("/api/ai-jewelry/history");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("Auth & Membership Endpoints", () => {
  it("GET /api/membership/plans returns public plans list", async () => {
    const res = await request(app).get("/api/membership/plans");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /api/me requires authorization", async () => {
    const res = await request(app).get("/api/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/dashboard blocks non-admin users with 403", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("POST /api/auth/login logs in admin@jewelai.com successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@jewelai.com",
      password: "Admin@2026",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe("ADMIN");
  });

  it("GET /api/admin/users returns user list with Active Plan indicator", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@jewelai.com",
      password: "Admin@2026",
    });

    const token = loginRes.body.data.token;
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.users)).toBe(true);
    expect(res.body.data.users[0]).toHaveProperty("hasActivePlan");
    expect(res.body.data.users[0]).toHaveProperty("activePlanLabel");
  });

  it("POST /api/try-on returns 403 MEMBERSHIP_REQUIRED for user without active membership", async () => {
    const res = await request(app)
      .post("/api/try-on")
      .set("Authorization", `Bearer ${userToken}`)
      .field("category", "earrings");

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("MEMBERSHIP_REQUIRED");
  });

  it("POST /api/try-on passes membership check for user with active membership (usr-demo-1)", async () => {
    const demoUserToken = authService.generateToken({
      id: "usr-demo-1",
      email: "ananya.sharma@tanishq-partner.com",
      role: "USER",
      name: "Ananya Sharma",
    });

    const res = await request(app)
      .post("/api/try-on")
      .set("Authorization", `Bearer ${demoUserToken}`)
      .field("category", "earrings");

    // Passed membership & credit checks, now fails at validation for missing images (not 500!)
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("MODEL_IMAGE_INVALID");
  });

  it("GET /api/me/usage returns 200 without DATABASE_URL", async () => {
    const res = await request(app)
      .get("/api/me/usage")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/me/notifications returns 200 without DATABASE_URL", async () => {
    const res = await request(app)
      .get("/api/me/notifications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});


