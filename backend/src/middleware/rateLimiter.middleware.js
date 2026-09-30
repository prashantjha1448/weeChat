import rateLimit from 'express-rate-limit';

/**
 * Phase 1 API Rate Limiter
 * 300 req / 15 min per IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: (req, res) => {
        res.setHeader('Retry-After', Math.ceil(15 * 60));
        return {
            status: 429,
            success: false,
            message: 'Too many requests. Please try again after 15 minutes.'
        };
    }
});

/**
 * Phase 1 Auth Rate Limiter (Brute-Force & Lockout Protection)
 * 10 failed attempts / 15 min per IP + email key
 * skipSuccessfulRequests: true
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { keyGenerator: false },
    keyGenerator: (req) => {
        const rawEmail = req.body?.email || req.body?.usernameOrEmail || req.body?.username || '';
        const emailStr = typeof rawEmail === 'string' ? rawEmail : '';
        return `${req.ip}_${emailStr.toLowerCase().trim()}`;
    },
    message: (req, res) => {
        res.setHeader('Retry-After', Math.ceil(15 * 60));
        return {
            status: 429,
            success: false,
            message: 'Too many failed authentication attempts. Please try again after 15 minutes.'
        };
    }
});

/**
 * Phase 1 Media Upload Limiter
 * 20 uploads / hour per user (or IP)
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { keyGenerator: false },
    keyGenerator: (req) => req.user?._id ? String(req.user._id) : req.ip,
    message: (req, res) => {
        res.setHeader('Retry-After', Math.ceil(60 * 60));
        return {
            status: 429,
            success: false,
            message: 'Upload limit reached. Please try again in an hour.'
        };
    }
});
