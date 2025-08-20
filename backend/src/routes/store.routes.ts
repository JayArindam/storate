import { Router } from "express";
import { createStoreReview } from "../controllers/store.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

// POST /api/store/review
router.post("/review", authenticate, createStoreReview);

export default router;