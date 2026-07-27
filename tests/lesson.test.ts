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
    email: "lesson@gmail.com",
  });

  await Lesson.deleteMany({});

  await request(app).post("/api/v1/auth/register").send({
    fullName: "Lesson User",
    email: "lesson@gmail.com",
    dateOfBirth: "2000-01-01",
    gender: "male",
    password: "password123",
  });

  const login = await request(app).post("/api/v1/auth/login").send({
    email: "lesson@gmail.com",
    password: "password123",
  });

  token = login.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Lesson API", () => {
  it("should create a lesson", async () => {
    const response = await request(app)
      .post("/api/v1/lessons")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Introduction to English",
        description: "Basic English lesson",
        level: "beginner",
        content: "This is the lesson content.",
        order: 1,
      });

    lessonId = response.body.lesson._id;

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Lesson created successfully");
    expect(response.body.lesson.title).toBe("Introduction to English");
  });

  it("should get all lessons", async () => {
    const response = await request(app).get("/api/v1/lessons");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get lesson by id", async () => {
    const response = await request(app).get(
      `/api/v1/lessons/${lessonId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Introduction to English");
  });

  it("should update a lesson", async () => {
    const response = await request(app)
      .put(`/api/v1/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Lesson",
        description: "Updated description",
        level: "beginner",
        content: "Updated content",
        order: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Lesson updated successfully");
    expect(response.body.lesson.title).toBe("Updated Lesson");
  });

  it("should delete a lesson", async () => {
    const lesson = await Lesson.create({
      title: "Delete Lesson",
      description: "Delete",
      level: "beginner",
      content: "Delete Content",
      order: 999,
    });

    const response = await request(app)
      .delete(`/api/v1/lessons/${lesson._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Lesson deleted successfully");
  });

  it("should not create lesson without token", async () => {
    const response = await request(app).post("/api/v1/lessons").send({
      title: "Lesson",
      description: "Test",
      level: "beginner",
      content: "Content",
      order: 1,
    });

    expect(response.status).toBe(401);
  });

  it("should not create lesson with missing fields", async () => {
    const response = await request(app)
      .post("/api/v1/lessons")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
      });

    expect(response.status).toBe(400);
  });

  it("should return 404 for invalid lesson id", async () => {
    const response = await request(app).get(
      "/api/v1/lessons/64aaaaaaaaaaaaaaaaaaaaaa"
    );

    expect(response.status).toBe(404);
  });

  it("should not update lesson without token", async () => {
    const lesson = await Lesson.create({
      title: "Temp",
      description: "Temp",
      level: "beginner",
      content: "Temp",
      order: 99,
    });

    const response = await request(app)
      .put(`/api/v1/lessons/${lesson._id}`)
      .send({
        title: "Updated",
      });

    expect(response.status).toBe(401);
  });

  it("should not delete lesson without token", async () => {
    const lesson = await Lesson.create({
      title: "Delete",
      description: "Delete",
      level: "beginner",
      content: "Delete",
      order: 100,
    });

    const response = await request(app).delete(
      `/api/v1/lessons/${lesson._id}`
    );

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existing lesson", async () => {
    const response = await request(app).get(
      "/api/v1/lessons/507f1f77bcf86cd799439011"
    );

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