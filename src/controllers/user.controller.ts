import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { SECRET_KEY } from "../config/constants";

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { fullName, email, dateOfBirth, gender, password } = req.body;

      if (!fullName || !email || !dateOfBirth || !gender || !password) {
        return res.status(400).json({ message: "All fields are required" });
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
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

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
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  async whoami(req: any, res: Response) {
    return res.json({
      success: true,
      user: req.user,
    });
  }

  async updateUser(req: any, res: Response) {
    try {
      const { fullName, dateOfBirth, gender } = req.body;

      const updateData: any = {
        fullName,
        dateOfBirth,
        gender,
      };

      if (req.file) {
        updateData.profileImage = req.file.filename;
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );

      return res.json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  async updatePassword(req: any, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      return res.json({
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}