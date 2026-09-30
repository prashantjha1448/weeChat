import mongoose from 'mongoose';

/**
 * ModerationAction Schema — Admin/Moderator Action Audit & Penalties
 * Human-Readable & Modular Schema Definition
 */
const ModerationActionSchema = new mongoose.Schema({
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Target user ID is required"],
        index: true
    },
    type: {
        type: String,
        enum: ["warn", "temp_ban", "perm_ban"],
        required: [true, "Moderation action type is required"],
        index: true
    },
    reason: {
        type: String,
        required: [true, "Moderation reason is required"],
        trim: true
    },
    expiresAt: {
        type: Date,
        default: null // Null for permanent bans; specific timestamp for temporary bans
    },
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Moderator/Admin ID is required"]
    }
}, {
    timestamps: true
});

const ModerationActionModel = mongoose.model('moderation_actions', ModerationActionSchema);
export default ModerationActionModel;
