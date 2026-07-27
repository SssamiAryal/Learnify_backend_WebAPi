import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { SECRET_KEY } from "../config/constants";
import { sendResetCode } from "../utils/email";

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { fullName, email, dateOfBirth, gender, password } = req.body;

      if (!fullName || !email || !dateOfBirth || !gender || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
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
      console.error("REGISTER ERROR:", error);

      return res.status(500).json({
        message: "Server error",
        error,
      });
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
    } catch {
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

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
      });

      return res.json({
        message: "User updated successfully",
        user,
      });
    } catch {
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
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const user: any = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetCode = code;
      await user.save();

      await sendResetCode(email, code);

      return res.json({
        success: true,
        message: "Verification code sent successfully",
      });
    } catch {
      return res.status(500).json({
        message: "Failed to send email",
      });
    }
  }

  async verifyResetCode(req: Request, res: Response) {
    try {
      const { email, code } = req.body;

      const user: any = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (user.resetCode !== code) {
        return res.status(400).json({
          message: "Invalid verification code",
        });
      }

      return res.json({
        success: true,
        message: "Code verified",
      });
    } catch {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user: any = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetCode = "";

      await user.save();

      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }
}