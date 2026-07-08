import express from "express";
const router = express.Router();
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", protect, getUserNotifications);
router.patch("/:id/read", protect, markNotificationAsRead);
export default router;
