jest.mock("../src/utils/email", () => ({
  sendResetCode: jest.fn().mockResolvedValue(true),
}));
import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app";
import { connectToMongoDB } from "../src/database/mongodb";
import { User } from "../src/models/user.model";

beforeAll(async () => {
  await connectToMongoDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication API", () => {
  it("should register a new user", async () => {
    await User.deleteOne({
      email: "testuser@gmail.com",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test User",
        email: "testuser@gmail.com",
        dateOfBirth: "2000-01-01",
        gender: "male",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  it("should login successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBeDefined();
  });
  it("should not login with wrong password", async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "testuser@gmail.com",
      password: "wrongpassword",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid password");
});
it("should not login with invalid email", async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "doesnotexist@gmail.com",
      password: "password123",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid email");
});
it("should not register an existing email", async () => {
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({
      fullName: "Another User",
      email: "testuser@gmail.com",
      dateOfBirth: "2000-01-01",
      gender: "male",
      password: "password123",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Email already exists");
});
it("should send reset code", async () => {
  const response = await request(app)
    .post("/api/v1/auth/forgot-password")
    .send({
      email: "testuser@gmail.com",
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
it("should verify reset code", async () => {
  const user = await User.findOne({
    email: "testuser@gmail.com",
  });

  const response = await request(app)
    .post("/api/v1/auth/verify-reset-code")
    .send({
      email: "testuser@gmail.com",
      code: user?.resetCode,
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
it("should reset password", async () => {
  const response = await request(app)
    .post("/api/v1/auth/reset-password")
    .send({
      email: "testuser@gmail.com",
      newPassword: "newpassword123",
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
it("should login with new password", async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "testuser@gmail.com",
      password: "newpassword123",
    });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});
it("should not send reset code for invalid email", async () => {
  const response = await request(app)
    .post("/api/v1/auth/forgot-password")
    .send({
      email: "invalid@gmail.com",
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("User not found");
});
});
