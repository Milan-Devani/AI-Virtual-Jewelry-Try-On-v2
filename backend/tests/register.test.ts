import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Registration & Authentication Flow", () => {
  it("registers a user with full profile (firstName, lastName, phoneNumber, email, password)", async () => {
    const email = `test.user.${Date.now()}@gmail.com`;
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Aarav",
      lastName: "Kapoor",
      phoneNumber: "+91 98765 43210",
      email,
      password: "Password@123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.name).toBe("Aarav Kapoor");
    expect(res.body.data.user.firstName).toBe("Aarav");
    expect(res.body.data.user.lastName).toBe("Kapoor");
    expect(res.body.data.user.phoneNumber).toBe("+91 98765 43210");

    // Verify user can log in with new credentials
    const loginRes = await request(app).post("/api/auth/login").send({
      email,
      password: "Password@123",
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.user.email).toBe(email);
    expect(loginRes.body.data.user.firstName).toBe("Aarav");
    expect(loginRes.body.data.user.phoneNumber).toBe("+91 98765 43210");

    // Verify /api/me returns full user details
    const token = loginRes.body.data.token;
    const meRes = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.firstName).toBe("Aarav");
    expect(meRes.body.data.user.lastName).toBe("Kapoor");
    expect(meRes.body.data.user.phoneNumber).toBe("+91 98765 43210");
  });

  it("registers a user with legacy payload (only name, email, password) without breaking", async () => {
    const email = `legacy.user.${Date.now()}@jewelai.com`;
    const res = await request(app).post("/api/auth/register").send({
      name: "Legacy Designer",
      email,
      password: "SecretPassword123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.name).toBe("Legacy Designer");
    expect(res.body.data.user.firstName).toBe("Legacy");
    expect(res.body.data.user.lastName).toBe("Designer");
  });

  it("rejects registration with invalid email format", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Invalid",
      lastName: "Email",
      phoneNumber: "1234567890",
      email: "invalid-email-address",
      password: "Password@123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with short password (< 6 characters)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Short",
      lastName: "Pass",
      phoneNumber: "1234567890",
      email: `shortpass.${Date.now()}@gmail.com`,
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects login with invalid email format (e.g. 'Royal')", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "Royal",
      password: "Password@123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/valid email address/i);
  });
});
