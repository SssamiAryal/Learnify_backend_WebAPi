import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { SECRET_KEY } from "../config/constants";

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      dateOfBirth,
      gender,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      dateOfBirth,
      gender,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};