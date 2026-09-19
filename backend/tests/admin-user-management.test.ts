import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { authService } from "../src/auth/auth.service.js";

const adminToken = authService.generateToken({
  id: "d4b79b5b-0393-40d3-8092-14a88d9734ca",
  email: "admin@jewelai.com",
  role: "ADMIN",
  name: "JEWELAI Administrator",
});

const regularUserToken = authService.generateToken({
  id: "regular-user-id",
  email: "customer@example.com",
  role: "USER",
  name: "Regular Customer",
});

describe("Admin User Management - Edit & Remove", () => {
  let createdUserId: string;
  const testEmail = `manage.test.${Date.now()}@gmail.com`;

  it("creates a customer user to manage", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Vikram",
        lastName: "Mehta",
        phoneNumber: "+91 91234 56789",
        email: testEmail,
        password: "Password@123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.id).toBeDefined();
    createdUserId = res.body.data.user.id;
  });

  it("rejects non-admin attempting to edit a user with 403 Forbidden", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${regularUserToken}`)
      .send({ firstName: "Hacker" });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("allows admin to edit user details (name, phone, plan)", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        firstName: "Vikram",
        lastName: "Patel",
        phoneNumber: "+91 99999 88888",
        planId: "plan-starter",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.lastName).toBe("Patel");
    expect(res.body.data.phoneNumber).toBe("+91 99999 88888");
  });

  it("rejects non-admin attempting to delete a user with 403 Forbidden", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${regularUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("allows admin to delete the user account", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("deleted");
  });

  it("confirms user is deleted and no longer found", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
