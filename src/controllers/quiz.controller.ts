import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Quiz from "../models/quiz.model";
import QuizResult from "../models/quizResult.model";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error,
    });
  }
};

export const getQuizByLesson = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({
      lessonId: req.params.lessonId,
    }).select("-correctAnswer");

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error,
    });
  }
};
export const submitQuiz = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { lessonId, answers } = req.body;

    const quizzes = await Quiz.find({ lessonId });

    let score = 0;

    for (const answer of answers) {
      const quiz = quizzes.find(
        (q) => q._id.toString() === answer.quizId
      );

      if (quiz && quiz.correctAnswer === answer.answer) {
        score++;
      }
    }

    const totalQuestions = quizzes.length;

    const percentage =
      totalQuestions === 0
        ? 0
        : Math.round((score / totalQuestions) * 100);
        await QuizResult.create({
  userId: req.user?._id,
  lessonId,
  score,
  totalQuestions,
  percentage,
});

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
      percentage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error,
    });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error,
    });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error,
    });
  }
};

export const getMyQuizResults = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const results = await QuizResult.find({
      userId: req.user?._id,
    }).populate("lessonId");

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz results",
      error,
    });
  }
};