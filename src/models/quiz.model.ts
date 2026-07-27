import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  lessonId: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizSchema = new Schema<IQuiz>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuiz>("Quiz", quizSchema);