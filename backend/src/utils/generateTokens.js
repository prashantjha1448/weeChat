import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserModel from "../models/user.model.js";
import AuthSessionModel from "../models/authSession.model.js";
import ApiError from './ApiError.js';
import { env } from '../config/env.js';
import { getRequestLocation } from './geoIp.js';

export const generateAccessAndRefreshTokens = async (userId, req = null) => {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found for token generation");
        }

        // Access Token — No PII, explicit HS256 algorithm, issuer & audience
        const accessToken = jwt.sign(
            {
                _id: String(user._id),
                role: user.role || 'user'
            },
            env.JWT_SECRET,
            {
                algorithm: 'HS256',
                issuer: 'weechat-auth',
                audience: 'weechat-client',
                expiresIn: '15m'
            }
        );

        // Refresh Token Generation
        const refreshToken = jwt.sign(
            {
                _id: String(user._id)
            },
            env.REFRESH_TOKEN_SECRET || env.JWT_SECRET,
            {
                algorithm: 'HS256',
                issuer: 'weechat-auth',
                audience: 'weechat-client',
                expiresIn: '7d'
            }
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Record session history in AuthSessionModel if request context is provided
        if (req) {
            try {
                const ua = req.headers['user-agent'] || 'Web Browser';
                const { ip, location } = getRequestLocation(req);
                const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

                await AuthSessionModel.create({
                    userId: user._id,
                    refreshTokenHash,
                    device: ua,
                    ip,
                    location,
                    expiresAt
                });
            } catch (sessErr) {
                console.warn('[AUTH SESSION LOGGING NOTICE]', sessErr.message);
            }
        }

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while generating tokens");
    }
};
