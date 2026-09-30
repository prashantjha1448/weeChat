import mongoose from 'mongoose';

/**
 * ChatMessage Schema — In-Call Real-Time Text Messages with Auto-Expiry
 * Human-Readable & Modular Schema Definition
 */
const ChatMessageSchema = new mongoose.Schema({
    callSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'call_sessions',
        required: [true, "Call session ID reference is required"],
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Sender user ID is required"],
        index: true
    },
    text: {
        type: String,
        required: [true, "Message text is required"],
        trim: true,
        maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    flagged: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index: Auto-deletes temporary message logs after expiry
    }
}, {
    timestamps: true
});

const ChatMessageModel = mongoose.model('chat_messages', ChatMessageSchema);
export default ChatMessageModel;
