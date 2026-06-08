import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8088;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/learnify";

export const SECRET_KEY =
  process.env.SECRET_KEY || "learnifysecretkey";