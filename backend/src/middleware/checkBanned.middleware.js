import ApiError from '../utils/ApiError.js';

/**
 * CheckBanned Middleware — Middleware 3
 * Rejects requests from accounts flagged as banned
 */
export const checkBanned = (req, res, next) => {
    if (req.user && req.user.isBanned) {
        throw new ApiError(403, "Your account has been banned due to Terms of Service violations.");
    }
    next();
};
