import { Router } from "express";
import { createStoreReview, getStoreListings, searchStores, storeOwnerDash } from "../controllers/store.controller";
import { authenticate, authorizeStoreOwner } from "../middlewares/auth.middlewares";
import { updatePassword } from "../controllers/auth.controller";
const router = Router();

// POST /api/store/review
router.post("/review", authenticate, createStoreReview);
router.get("/search", authenticate, searchStores);
router.get("/listings", authenticate, getStoreListings);
router.get("/dashboard", authenticate, authorizeStoreOwner, storeOwnerDash);
router.post("/update-password", authenticate, authorizeStoreOwner, updatePassword);

export default router;