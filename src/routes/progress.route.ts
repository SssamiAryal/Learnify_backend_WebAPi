import { Router } from "express";
import progressController from "../controllers/progress.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Complete a lesson
router.post("/complete", authMiddleware, progressController.completeLesson);

// Get logged-in user's progress
router.get("/my-progress", authMiddleware, progressController.getMyProgress);

export default router;