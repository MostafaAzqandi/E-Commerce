import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";

// @desc    Get logged-in user's notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({
      createdAt: -1,
    })
    .limit(50);

  res.status(200).json(notifications);
});

// @desc    Mark a specific notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true },
    { new: true, runValidators: true },
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found or unauthorized");
  }

  res.status(200).json(notification);
});
