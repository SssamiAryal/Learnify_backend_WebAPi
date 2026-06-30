import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authMiddleware, isAdmin } from "../../middleware/auth.middleware";

const router = Router();

const adminController = new AdminUserController();

router.get(
  "/",
  authMiddleware,
  isAdmin,
  adminController.getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  adminController.getUserById
);

router.post(
  "/",
  authMiddleware,
  isAdmin,
  adminController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  adminController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  adminController.deleteUser
);

export default router;