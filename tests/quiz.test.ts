import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app";
import { connectToMongoDB } from "../src/database/mongodb";

import { User } from "../src/models/user.model";
import { Lesson } from "../src/models/lesson.model";
import Quiz from "../src/models/quiz.model";
import QuizResult from "../src/models/quizResult.model";

let token = "";
let lessonId = "";
let quizId = "";

beforeAll(async () => {
  await connectToMongoDB();

  await User.deleteOne({
    email: "quiz@gmail.com",
  });

  await Lesson.deleteMany({});
  await Quiz.deleteMany({});
  await QuizResult.deleteMany({});

  await request(app).post("/api/v1/auth/register").send({
    fullName: "Quiz User",
    email: "quiz@gmail.com",
    dateOfBirth: "2000-01-01",
    gender: "male",
    password: "password123",
  });

  const login = await request(app).post("/api/v1/auth/login").send({
    email: "quiz@gmail.com",
    password: "password123",
  });

  token = login.body.token;

  const lesson = await Lesson.create({
    title: "Quiz Lesson",
    description: "Lesson Description",
    level: "beginner",
    content: "Lesson Content",
    order: 1,
  });

  lessonId = lesson._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Quiz API", () => {
  it("should create quiz", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes")
      .send({
        lessonId,
        question: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    quizId = response.body.data._id;
  });

  it("should get quiz by lesson", async () => {
    const response = await request(app).get(
      `/api/v1/quizzes/${lessonId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should submit quiz with correct answer", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lessonId,
        answers: [
          {
            quizId,
            answer: "4",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(1);
    expect(response.body.percentage).toBe(100);
  });

  it("should submit quiz with wrong answer", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lessonId,
        answers: [
          {
            quizId,
            answer: "2",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(0);
  });

  it("should get my quiz results", async () => {
    const response = await request(app)
      .get("/api/v1/quizzes/my/results")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should update quiz", async () => {
    const response = await request(app)
      .put(`/api/v1/quizzes/${quizId}`)
      .send({
        question: "Updated Question",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.question).toBe("Updated Question");
  });

  it("should delete quiz", async () => {
    const response = await request(app)
      .delete(`/api/v1/quizzes/${quizId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should not create quiz with missing fields", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes")
      .send({
        lessonId,
      });

    expect(response.status).toBe(500);
  });

  it("should not submit quiz without token", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes/submit")
      .send({
        lessonId,
        answers: [],
      });

    expect(response.status).toBe(401);
  });

  it("should return empty quiz list for invalid lesson", async () => {
    const fakeLessonId = new mongoose.Types.ObjectId();

    const response = await request(app).get(
      `/api/v1/quizzes/${fakeLessonId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(0);
  });

  it("should return 404 when updating invalid quiz", async () => {
    const fakeQuizId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/api/v1/quizzes/${fakeQuizId}`)
      .send({
        question: "Test",
      });

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting invalid quiz", async () => {
    const fakeQuizId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/v1/quizzes/${fakeQuizId}`);

    expect(response.status).toBe(404);
  });

  it("should return unauthorized when getting results without token", async () => {
    const response = await request(app).get(
      "/api/v1/quizzes/my/results"
    );

    expect(response.status).toBe(401);
  });

  it("should create multiple quizzes", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes")
      .send({
        lessonId,
        question: "Capital of Nepal?",
        options: ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar"],
        correctAnswer: "Kathmandu",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should return multiple quizzes", async () => {
    const response = await request(app).get(
      `/api/v1/quizzes/${lessonId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should submit quiz with empty answers", async () => {
    const response = await request(app)
      .post("/api/v1/quizzes/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lessonId,
        answers: [],
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(0);
  });
});