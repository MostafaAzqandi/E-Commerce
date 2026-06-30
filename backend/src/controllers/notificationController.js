import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";

// @desc    Get logged-in user's notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(notifications);
});
