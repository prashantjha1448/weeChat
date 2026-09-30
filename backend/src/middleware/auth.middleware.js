import UserModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "").trim();

        if (!token) {
            throw new ApiError(401, "Unauthorized request - Token missing");
        }

        let decoded;
        try {
            decoded = jwt.verify(token, env.JWT_SECRET, {
                algorithms: ['HS256'],
                issuer: 'nexus-auth',
                audience: 'nexus-client'
            });
        } catch (err) {
            // Fallback for legacy tokens during transition
            decoded = jwt.verify(token, env.JWT_SECRET);
        }

        const user = await UserModel.findById(decoded?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found");
        }

        if (user.isBanned) {
            throw new ApiError(403, "User account is banned");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(error.statusCode || 401, error?.message || "Invalid or Expired Access Token");
    }
};

export default authMiddleware;