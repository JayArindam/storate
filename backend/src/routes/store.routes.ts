import { Router } from "express";
import { createStoreReview, searchStores } from "../controllers/store.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

// POST /api/store/review
router.post("/review", authenticate, createStoreReview);
router.get("/search", authenticate, searchStores);

export default router;