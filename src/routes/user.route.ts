import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const router = Router();
const userController = new UserController();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.get("/whoami", authMiddleware, userController.whoami);

router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"),
  userController.updateUser
);

export default router;