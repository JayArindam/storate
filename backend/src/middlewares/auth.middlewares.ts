import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number };

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findByPk(req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};