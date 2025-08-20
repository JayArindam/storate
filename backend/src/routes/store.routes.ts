import { Router } from "express";
import { createStoreReview, getStoreListings, searchStores } from "../controllers/store.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

// POST /api/store/review
router.post("/review", authenticate, createStoreReview);
router.get("/search", authenticate, searchStores);
router.get("/listings", authenticate, getStoreListings);

export default router;