import jwt from 'jsonwebtoken';
import AdminModel from '../models/admin.model.js';

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

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || '4638eba7436cd7a8fc62356843f368f370c9e57449c4869940c8a447b9094bf4'
        );

        // Fetch strictly from dedicated `admins` collection
        const admin = await AdminModel.findById(decoded._id).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Admin account not found in authorized administrators registry"
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Admin account has been deactivated"
            });
        }

        req.user = admin;
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid or expired admin session token: " + err.message
        });
    }
};
