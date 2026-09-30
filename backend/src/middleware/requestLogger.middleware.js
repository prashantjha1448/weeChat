import crypto from 'crypto';

/**
 * RequestLogger & RequestID Middleware
 * Assigns unique requestId and sets x-request-id response header
 */
export const requestLogger = (req, res, next) => {
    const requestId = req.header('x-request-id') || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    // Skip logging health & readiness endpoints to prevent log clutter
    if (req.originalUrl === '/health' || req.originalUrl === '/ready' || req.originalUrl === '/health/health' || req.originalUrl === '/health/ready') {
        return next();
    }

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
};
