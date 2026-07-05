import express from "express";
import {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", rateLimiterMiddleware(30, 5, "auth"), authUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
