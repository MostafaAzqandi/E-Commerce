import Notification from "../models/notificationModel.js";

/**
 * Global utility to create background user notifications and emit them via WebSockets
 */
const createNotification = async ({ user, title, message, link }) => {
  try {
    const notification = await Notification.create({
      user,
      title,
      message,
      link,
    });

    const targetUserId = user?.toString();

    if (global.io && targetUserId) {
      console.log(
        `📡 Sending live WebSocket notification to user: ${targetUserId}`,
      );

      global.io.to(targetUserId).emit("new_notification", notification);
    } else if (!global.io) {
      console.warn("⚠️ WebSocket server (global.io) is not initialized.");
    }

    return notification;
  } catch (error) {
    console.error(
      "❌ Error creating/sending real-time notification:",
      error.message,
    );
    throw error;
  }
};

export default createNotification;
