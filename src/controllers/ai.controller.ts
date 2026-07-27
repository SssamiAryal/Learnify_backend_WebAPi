import { Request, Response } from "express";
import { askGemini } from "../services/gemini.service";

export class AIController {
  async chat(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          message: "Message is required",
        });
      }

      const reply = await askGemini(message);

      return res.json({
        success: true,
        reply,
      });
    } catch (error: any) {
  console.error(error);

  return res.status(500).json({
    message: "Failed to get AI response",
    error: error.message,
  });
}
  }
}