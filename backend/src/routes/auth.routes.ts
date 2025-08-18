import { Router } from "express";
import { signup, login, updatePassword } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(authenticate);

router.post("/update-password", updatePassword);

export default router;