import express from "express";
const router = express.Router();
import { getUserNotifications } from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", protect, getUserNotifications);

export default router;
