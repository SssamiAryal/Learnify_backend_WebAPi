import express from "express";
import {
  createQuiz,
  getQuizByLesson,
  submitQuiz,
  deleteQuiz,
  updateQuiz,
  getMyQuizResults,
} from "../controllers/quiz.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Admin creates quiz
router.post("/", createQuiz);

router.get("/my/results", authMiddleware, getMyQuizResults);

// Student gets quiz by lesson
router.get("/:lessonId", getQuizByLesson);

// Student submits quiz
router.post("/submit", authMiddleware, submitQuiz);
// Admin deletes quiz
router.delete("/:quizId", deleteQuiz);

router.put("/:quizId", updateQuiz);

export default router;