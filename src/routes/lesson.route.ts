import { Router } from "express";
import { LessonController } from "../controllers/lesson.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const router = Router();
const lessonController = new LessonController();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  lessonController.createLesson
);

router.get("/", lessonController.getAllLessons);

router.get("/:id", lessonController.getLessonById);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  lessonController.updateLesson
);

router.delete("/:id", authMiddleware, lessonController.deleteLesson);

export default router;