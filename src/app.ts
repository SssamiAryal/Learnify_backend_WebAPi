import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/user.route";
import uploadRoute from "./routes/upload.route";
import adminUserRoute from "./routes/admin/user.route";
import lessonRoute from "./routes/lesson.route";
import progressRoute from "./routes/progress.route";
import quizRoute from "./routes/quiz.route"; 
import aiRoute from "./routes/ai.route";

dotenv.config();

const app: Application = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/lessons", lessonRoute);
app.use("/api/v1/progress", progressRoute);
app.use("/api/v1/quizzes", quizRoute); 
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/admin/users", adminUserRoute);
app.use("/api/v1/upload", uploadRoute);

app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API running",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;