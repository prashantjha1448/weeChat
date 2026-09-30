import NotificationModel from '../models/notification.model.js';

/**
 * Notification Service — User In-App & Push Notifications
 */

export const createNotificationService = async (userId, title, body, type = "system") => {
    const notification = await NotificationModel.create({
        userId,
        title,
        body,
        type
    });

    return notification;
};

export const getUserNotificationsService = async (userId, limit = 20) => {
    const notifications = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);

    return notifications;
};

export const markNotificationReadService = async (notificationId, userId) => {
    const updated = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );

    return updated;
};
