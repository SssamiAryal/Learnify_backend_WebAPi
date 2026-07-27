import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  password: string;
  profileImage?: string;
  role: "admin" | "user";
  status: "active" | "inactive";

  resetCode?: string;
  resetCodeExpiry?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    resetCode: {
      type: String,
      default: "",
    },

    resetCodeExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);