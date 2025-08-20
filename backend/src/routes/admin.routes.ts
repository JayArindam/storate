import { Router } from "express";
import { createUserByAdmin } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorizeAdmin } from "../middlewares/auth.middlewares";
import { getUserStatistics } from "../controllers/admin.controller";
import { createStore } from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post("/create-user", createUserByAdmin);
router.get("/stats", getUserStatistics);
router.post("/create-store", createStore);

export default router;