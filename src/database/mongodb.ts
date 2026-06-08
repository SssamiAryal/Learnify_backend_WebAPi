import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constants";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};