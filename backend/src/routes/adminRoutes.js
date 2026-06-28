import express from "express";
const router = express.Router();
import { getDashboardStats } from "../controllers/adminController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.get("/stats", protect, admin, getDashboardStats);

export default router;
