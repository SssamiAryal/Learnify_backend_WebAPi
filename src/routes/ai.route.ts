import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();
const aiController = new AIController();

router.post("/chat", aiController.chat);

export default router;