// backend/src/services/notificationService.js
import Notification from "../models/notificationModel.js";

/**
 * Global utility to create background user notifications
 * @param {Object} params
 * @param {string} params.user - The target user ObjectId
 * @param {string} params.title - Notification header
 * @param {string} params.message - Detailed body text
 * @param {string} [params.link] - Optional frontend routing target redirect URL
 */
const createNotification = async ({ user, title, message, link }) => {
  try {
    await Notification.create({ user, title, message, link });
  } catch (error) {
    console.error(`Notification failed to dispatch: ${error.message}`);
  }
};
export default createNotification;
