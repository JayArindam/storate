import { Router } from "express";
import { createUserByAdmin, getAllStoresForAdmin } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorizeAdmin } from "../middlewares/auth.middlewares";
import { getUserStatistics } from "../controllers/admin.controller";
import { adminDash } from "../controllers/admin.controller";
import { createStore } from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post("/create-user", createUserByAdmin);
router.get("/stats", getUserStatistics);
router.post("/create-store", createStore);
router.get("/dashboard", authenticate, authorizeAdmin, adminDash);
router.get("/stores", authenticate, authorizeAdmin, getAllStoresForAdmin);

export default router;