import express from "express";
import { signup, login, updatePassword } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protect everything that comes after this line
router.use(authenticate);

// Protected routes
router.post("/update-password", updatePassword);

export default router;
