import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app";
import { connectToMongoDB } from "../src/database/mongodb";
import { User } from "../src/models/user.model";
import { Lesson } from "../src/models/lesson.model";

let token = "";
let lessonId = "";

beforeAll(async () => {
  await connectToMongoDB();

  await User.deleteOne({
    email: "progress@gmail.com",
  });

  await request(app).post("/api/v1/auth/register").send({
    fullName: "Progress User",
    email: "progress@gmail.com",
    dateOfBirth: "2000-01-01",
    gender: "male",
    password: "password123",
  });

  const login = await request(app).post("/api/v1/auth/login").send({
    email: "progress@gmail.com",
    password: "password123",
  });

  token = login.body.token;

  const lesson = await Lesson.create({
    title: "Progress Lesson",
    description: "Testing Progress",
    level: "beginner",
    content: "Lesson Content",
    order: 999,
  });

  lessonId = lesson._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Progress API", () => {

  it("should complete a lesson", async () => {
    const response = await request(app)
      .post("/api/v1/progress/complete")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lessonId,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should get user progress", async () => {
    const response = await request(app)
      .get("/api/v1/progress/my-progress")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should not complete lesson without token", async () => {
    const response = await request(app)
      .post("/api/v1/progress/complete")
      .send({
        lessonId,
      });

    expect(response.status).toBe(401);
  });

  it("should not get progress without token", async () => {
    const response = await request(app)
      .get("/api/v1/progress/my-progress");

    expect(response.status).toBe(401);
  });

  it("should not complete lesson without lessonId", async () => {
    const response = await request(app)
      .post("/api/v1/progress/complete")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });
  it("should return 404 for non-existing lesson", async () => {
  const response = await request(app)
    .get("/api/v1/lessons/507f1f77bcf86cd799439011");

  expect(response.status).toBe(404);
});
it("should fail updating invalid lesson id", async () => {
  const response = await request(app)
    .put("/api/v1/lessons/123")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Updated",
    });

  expect(response.status).toBe(500);
});
it("should fail deleting invalid lesson id", async () => {
  const response = await request(app)
    .delete("/api/v1/lessons/123")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(500);
});
it("should create another lesson with same order", async () => {
  const response = await request(app)
    .post("/api/v1/lessons")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Another Lesson",
      description: "Testing",
      level: "beginner",
      content: "Hello",
      order: 1,
    });

  expect(response.status).toBe(201);
});
it("should create advanced lesson", async () => {
  const response = await request(app)
    .post("/api/v1/lessons")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Advanced",
      description: "Advanced lesson",
      level: "advanced",
      content: "Advanced Content",
      order: 500,
    });

  expect(response.status).toBe(201);
});
});