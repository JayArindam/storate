import { Router } from "express";
import { testHello } from "../controllers/test.controller";

const router = Router();

router.get("/test", testHello);

export default router;