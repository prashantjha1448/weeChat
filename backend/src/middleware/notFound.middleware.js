import ApiError from '../utils/ApiError.js';

/**
 * NotFound Middleware — Middleware 7
 * Standard 404 handler for invalid routes
 */
export const notFound = (req, res, next) => {
    throw new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`);
};
