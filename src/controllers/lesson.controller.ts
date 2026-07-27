import { Request, Response } from "express";
import { Lesson } from "../models/lesson.model";
import progressRepository from "../repositories/progress.repository";

export class LessonController {
  async createLesson(req: Request, res: Response) {
    try {
      const { title, description, level, content, order } = req.body;

      if (!title || !description || !level || !content || !order) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const lesson = await Lesson.create({
        title,
        description,
        level,
        content,
        order,
        image: req.file ? req.file.filename : "",
      });

      return res.status(201).json({
        message: "Lesson created successfully",
        lesson,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async getAllLessons(req: Request, res: Response) {
    try {
      const lessons = await Lesson.find().sort({ order: 1 });

      return res.json(lessons);
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async getLessonById(req: Request, res: Response) {
    try {
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      return res.json(lesson);
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async updateLesson(req: Request, res: Response) {
    try {
      const updateData: any = {
        ...req.body,
      };

      if (req.file) {
        updateData.image = req.file.filename;
      }

      const lesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      return res.json({
        message: "Lesson updated successfully",
        lesson,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async deleteLesson(req: Request, res: Response) {
    try {
      const lessonId = String(req.params.id);

      await Lesson.findByIdAndDelete(lessonId);

      await progressRepository.deleteProgressByLessonId(lessonId);

      return res.json({
        message: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}

export default new LessonController();