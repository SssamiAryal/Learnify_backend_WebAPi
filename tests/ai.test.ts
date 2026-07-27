import request from "supertest";
import app from "../src/app";

jest.mock("../src/services/gemini.service", () => ({
  askGemini: jest.fn(),
}));

import { askGemini } from "../src/services/gemini.service";

describe("AI API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return AI response", async () => {
    (askGemini as jest.Mock).mockResolvedValue("Hello from AI");

    const response = await request(app)
      .post("/api/v1/ai/chat")
      .send({
        message: "Hello",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBe("Hello from AI");
  });

  it("should return 400 when message is missing", async () => {
    const response = await request(app)
      .post("/api/v1/ai/chat")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Message is required");
  });

  it("should return 400 when message is empty", async () => {
    const response = await request(app)
      .post("/api/v1/ai/chat")
      .send({
        message: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Message is required");
  });

  it("should return AI reply for another prompt", async () => {
    (askGemini as jest.Mock).mockResolvedValue("Artificial Intelligence");

    const response = await request(app)
      .post("/api/v1/ai/chat")
      .send({
        message: "What is AI?",
      });

    expect(response.status).toBe(200);
    expect(response.body.reply).toBe("Artificial Intelligence");
  });

  it("should return 500 when Gemini service fails", async () => {
    (askGemini as jest.Mock).mockRejectedValue(
      new Error("Gemini Error")
    );

    const response = await request(app)
      .post("/api/v1/ai/chat")
      .send({
        message: "Hello",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to get AI response");
  });
});