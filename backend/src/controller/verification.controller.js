import ApiResponse from '../utils/ApiResponse.js';
import UserModel from '../models/user.model.js';
import { generateVerificationOtpService, verifyOtpTokenService } from '../services/verification.service.js';

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
    const { type } = req.body;
    const { otp, expiresAt } = await generateVerificationOtpService(req.user._id, type || "email_verify");
    console.log(`[EMAIL OTP] Resent OTP for user ${req.user.email}: ${otp}`);
    return res.status(200).json(new ApiResponse(200, { expiresAt, otp }, "Verification OTP sent successfully"));
};

// POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    await verifyOtpTokenService(req.user._id, otp, "email_verify");

    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { isVerified: true },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, { user: updatedUser, isVerified: true }, "Email verified successfully"));
};

