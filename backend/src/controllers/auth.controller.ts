import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";

export const signup = async (req: Request, res: Response) => {
    const { name, email, address, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // role gets created as "user" by default
    const user = await User.create({
        name,
        email,
        address,
        password: hashedPassword,
    });

    return res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error("JWT env variables are missing");
    }

    const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { oldPassword, newPassword } = req.body;

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) {
    return res.status(403).json({ message: "Old password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
};