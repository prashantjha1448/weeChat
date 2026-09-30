import ApiResponse from '../utils/ApiResponse.js';
import {
    getUserNotificationsService,
    markNotificationReadService
} from '../services/notification.service.js';

// GET /api/notifications
export const getUserNotifications = async (req, res) => {
    const notifications = await getUserNotificationsService(req.user._id);
    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
    const { id } = req.params;
    const notification = await markNotificationReadService(id, req.user._id);
    return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
};
