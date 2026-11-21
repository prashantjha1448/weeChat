import mongoose from 'mongoose';

/**
 * CallSession Schema — 1-on-1 WebRTC Video Call Metadata & Log
 * Human-Readable & Modular Schema Definition
 */
const CallSessionSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User A reference is required"],
        index: true
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User B reference is required"],
        index: true
    },
    startedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    endedAt: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0 // Total call duration in seconds
    },
    endReason: {
        type: String,
        enum: ["user_skipped", "user_disconnected", "network_dropped", "reported"],
        default: "user_skipped"
    }
}, {
    timestamps: true
});

const CallSessionModel = mongoose.model('call_sessions', CallSessionSchema);
export default CallSessionModel;
