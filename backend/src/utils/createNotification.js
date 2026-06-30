import Notification from "../models/notificationModel.js";
import { userSocketMap } from "../server.js";
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

    if (global.io) {
      console.log(`📡 Sending live WebSocket notification to user: ${user}`);
      global.io.to(user.toString()).emit("new_notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Error sending real-time notification:", error.message);
  }
};
export default createNotification;
