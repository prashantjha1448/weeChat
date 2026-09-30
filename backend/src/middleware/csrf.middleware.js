import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * CSRF Protection Middleware for Cookie Authentication
 * Validates Origin/Referer against env.parsedClientUrls & enforces X-Requested-With header
 */
export const csrfProtection = (req, res, next) => {
    // Only check state-changing HTTP methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const requestedWith = req.header('X-Requested-With');
    if (requestedWith !== 'weechat' && requestedWith !== 'nexus') {
        throw new ApiError(403, 'CSRF Protection: Missing or invalid X-Requested-With header');
    }

    const origin = req.header('Origin') || req.header('Referer');
    if (origin) {
        try {
            const originUrl = new URL(origin).origin;
            const isAllowed = env.parsedClientUrls.some(allowed => {
                const allowedOrigin = new URL(allowed).origin;
                return allowedOrigin === originUrl;
            });

            if (!isAllowed && env.NODE_ENV === 'production') {
                throw new ApiError(403, 'CSRF Protection: Forbidden untrusted origin');
            }
        } catch (err) {
            if (err instanceof ApiError) throw err;
            // Ignore parse errors on local dev headers
        }
    }

    next();
};
