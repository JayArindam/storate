import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";

export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
  const { name, email, password, address, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    address,
    password: hashedPassword,
    role: role || "user",
  });

  return res.status(201).json(newUser);
};

export const getUserStatistics = async (req: Request, res: Response) => {
  const allUsers = await User.findAll();

  const adminCount = allUsers.filter((u) => u.role === "admin").length;
  const userCount = allUsers.filter((u) => u.role === "user").length;

  return res.status(200).json({
    adminCount,
    userCount,
    users: allUsers,
  });
};