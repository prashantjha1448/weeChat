import VerificationTokenModel from '../models/verificationToken.model.js';
import UserModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import crypto from 'crypto';

/**
 * Verification Service — Email Verification, Password Reset & OTPs
 */

// Generate Verification OTP Token
export const generateVerificationOtpService = async (userId, type = "otp") => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto.createHash('sha256').update(otp).digest('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await VerificationTokenModel.create({
        userId,
        type,
        tokenHash,
        expiresAt
    });

    return { otp, expiresAt };
};

// Verify OTP Token
export const verifyOtpTokenService = async (userId, otp, type = "otp") => {
    const tokenHash = crypto.createHash('sha256').update(otp).digest('hex');

    const tokenDoc = await VerificationTokenModel.findOne({
        userId,
        type,
        tokenHash
    });

    if (!tokenDoc) {
        throw new ApiError(400, "Invalid or expired OTP token");
    }

    // Delete token after successful verification
    await VerificationTokenModel.findByIdAndDelete(tokenDoc._id);

    return { verified: true };
};
