import mongoose from 'mongoose';

/**
 * AuthSession Schema — Active User Logged-in Devices & Session Tokens
 * Human-Readable & Modular Schema Definition
 */
const AuthSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        index: true
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"]
    },
    device: {
        type: String,
        default: "Unknown Device",
        trim: true
    },
    ip: {
        type: String,
        default: "",
        trim: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index: MongoDB auto-removes document when expiresAt is reached
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const AuthSessionModel = mongoose.model('auth_sessions', AuthSessionSchema);
export default AuthSessionModel;
