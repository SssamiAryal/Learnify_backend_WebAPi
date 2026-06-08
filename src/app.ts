import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/user.route";

dotenv.config();

const app: Application = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API running" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;