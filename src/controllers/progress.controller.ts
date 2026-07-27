import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import progressRepository from "../repositories/progress.repository";

export class ProgressController {
  async completeLesson(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      const { lessonId } = req.body;

      if (!userId || !lessonId) {
        return res.status(400).json({
          success: false,
          message: "User ID and Lesson ID are required",
        });
      }

      const progress = await progressRepository.completeLesson(
        userId.toString(),
        lessonId
      );

      return res.status(200).json({
        success: true,
        message: "Lesson completed successfully",
        data: progress,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to complete lesson",
      });
    }
  }

  async getMyProgress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      const progress = await progressRepository.getUserProgress(
        userId.toString()
      );

      return res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch progress",
      });
    }
  }
}

export default new ProgressController();