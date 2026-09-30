import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import ApiError from './ApiError.js';
import { env } from '../config/env.js';

export const generateAccessAndRefreshTokens = async (userId) => {
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
                issuer: 'nexus-auth',
                audience: 'nexus-client',
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
                issuer: 'nexus-auth',
                audience: 'nexus-client',
                expiresIn: '7d'
            }
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while generating tokens");
    }
};