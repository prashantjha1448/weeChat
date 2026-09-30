import mongoose from 'mongoose';

/**
 * Appeal Schema — Account Restriction Appeal & Review Requests
 * Human-Readable & Modular Schema Definition
 */
const AppealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID is required"],
        index: true
    },
    moderationActionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moderation_actions',
        required: [true, "Moderation action ID reference is required"]
    },
    message: {
        type: String,
        required: [true, "Appeal explanation message is required"],
        trim: true,
        maxlength: [1000, "Appeal message cannot exceed 1000 characters"]
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        index: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    }
}, {
    timestamps: true
});

const AppealModel = mongoose.model('appeals', AppealSchema);
export default AppealModel;
