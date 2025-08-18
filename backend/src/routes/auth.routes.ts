import express from "express";
import { signup, login, updatePassword } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-password", updatePassword);

export default router;
