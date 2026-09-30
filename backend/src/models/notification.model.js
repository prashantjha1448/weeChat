import mongoose from 'mongoose';

/**
 * Notification Schema — In-App & Push Notifications
 * Human-Readable & Modular Schema Definition
 */
const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        index: true
    },
    type: {
        type: String,
        enum: ["system", "match", "moderation", "promo"],
        default: "system",
        index: true
    },
    title: {
        type: String,
        required: [true, "Notification title is required"],
        trim: true
    },
    body: {
        type: String,
        required: [true, "Notification body text is required"],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

const NotificationModel = mongoose.model('notifications', NotificationSchema);
export default NotificationModel;
