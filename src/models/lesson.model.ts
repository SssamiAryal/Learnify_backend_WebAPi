import mongoose from "mongoose";

export interface ILesson {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  content: string;
  order: number;
  image?: string;
}

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);