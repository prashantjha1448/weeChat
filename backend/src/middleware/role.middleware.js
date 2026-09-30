import ApiError from '../utils/ApiError.js';

/**
 * Role-Based Access Control (RBAC) Middleware — Step 5: Middleware
 * Ensures user has required role (e.g., ['admin', 'moderator'])
 */
export const requireRole = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`);
        }

        next();
    };
};
