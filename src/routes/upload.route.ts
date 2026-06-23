import express from "express";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.json({
    imageUrl: `http://localhost:8088/uploads/${req.file.filename}`,
  });
});

export default router;