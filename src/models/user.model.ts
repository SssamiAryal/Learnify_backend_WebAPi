import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);