import ProfileModel from '../models/profile.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * RequireProfileComplete Middleware — Middleware 14
 * Ensures user profile onboarding is completed before entering video matchmaking
 */
export const requireProfileComplete = async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }

    const profile = await ProfileModel.findOne({ userId: req.user._id });
    if (!profile || !profile.displayName || !profile.gender) {
        throw new ApiError(403, "Please complete your profile onboarding before joining matchmaking.");
    }

    req.profile = profile;
    next();
};
