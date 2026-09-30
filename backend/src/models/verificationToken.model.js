import mongoose from 'mongoose';

/**
 * VerificationToken Schema — Email Verification, Password Reset & OTP Tokens
 * Human-Readable & Modular Schema Definition
 */
const VerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        index: true
    },
    type: {
        type: String,
        enum: ["email_verify", "password_reset", "otp"],
        required: [true, "Token type is required"],
        index: true
    },
    tokenHash: {
        type: String,
        required: [true, "Token hash is required"]
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index: Auto-deletes document upon token expiry
    }
}, {
    timestamps: true
});

const VerificationTokenModel = mongoose.model('verification_tokens', VerificationTokenSchema);
export default VerificationTokenModel;
