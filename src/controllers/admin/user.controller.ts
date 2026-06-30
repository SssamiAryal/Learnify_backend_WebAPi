import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/user.model";

export class AdminUserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string) || "";

      const query: any = {};

      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const total = await User.countDocuments(query);

      const users = await User.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.json({
        data: users,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const {
        fullName,
        email,
        dateOfBirth,
        gender,
        password,
        role,
      } = req.body;

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
        role,
      });

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updateData: any = { ...req.body };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}