import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.cookies?.admin_token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Authentication token required for Admin Web access"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '4638eba7436cd7a8fc62356843f368f370c9e57449c4869940c8a447b9094bf4');
        const user = await UserModel.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "User account not found"
            });
        }

        if (user.role !== 'admin' && user.role !== 'moderator') {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Access Denied: Requires Admin or Moderator role privileges"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid or expired session token: " + err.message
        });
    }
};
