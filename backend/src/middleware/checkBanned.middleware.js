import ApiError from '../utils/ApiError.js';
import BannedIdentifierModel from '../models/bannedIdentifier.model.js';

/**
 * CheckBanned Middleware — Middleware 3
 * Rejects requests from accounts or IP addresses flagged as banned
 */
export const checkBanned = async (req, res, next) => {
    try {
        if (req.user && req.user.isBanned) {
            throw new ApiError(403, "Your account has been banned due to Terms of Service violations.");
        }

        const clientIp = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim();
        if (clientIp) {
            const isIpBanned = await BannedIdentifierModel.findOne({
                type: 'ip',
                value: clientIp,
                $or: [
                    { expiresAt: null },
                    { expiresAt: { $gt: new Date() } }
                ]
            });

            if (isIpBanned) {
                throw new ApiError(403, "Access from your network has been restricted due to violations.");
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
