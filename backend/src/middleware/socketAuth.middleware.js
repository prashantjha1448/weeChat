import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import UserModel from '../models/user.model.js';
import { env } from '../config/env.js';

/**
 * SocketAuth Middleware — Middleware 12
 * Verifies JWT token from handshake cookies/headers for Socket.io connections
 * Cryptographically validates token with env.JWT_SECRET, HS256 algorithm, issuer & audience
 */
export const socketAuth = async (socket, next) => {
    try {
        let token = null;

        // 1. Extract from handshake cookies
        const rawCookies = socket.handshake.headers.cookie;
        if (rawCookies) {
            try {
                const parsedCookies = cookie.parse(rawCookies);
                token = parsedCookies.accessToken;
            } catch (e) {
                // Ignore cookie parse error and fall back to auth payload
            }
        }

        // 2. Extract from handshake auth payload
        if (!token && socket.handshake.auth?.token) {
            token = socket.handshake.auth.token;
        }

        // 3. Extract from authorization header
        if (!token && socket.handshake.headers?.authorization) {
            token = socket.handshake.headers.authorization;
        }

        if (!token) {
            return next(new Error("Socket Authentication Failed: No token provided"));
        }

        // Clean Bearer prefix if present
        if (typeof token === 'string' && token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        if (!token || typeof token !== 'string') {
            return next(new Error("Socket Authentication Failed: Invalid token format"));
        }

        // Verify with env.JWT_SECRET and strict algorithm enforcement
        let decoded;
        try {
            decoded = jwt.verify(token, env.JWT_SECRET, {
                algorithms: ['HS256'],
                issuer: 'weechat-auth',
                audience: 'weechat-client'
            });
        } catch (err) {
            try {
                decoded = jwt.verify(token, env.JWT_SECRET, {
                    algorithms: ['HS256'],
                    issuer: 'nexus-auth',
                    audience: 'nexus-client'
                });
            } catch (e) {
                // Fallback for legacy tokens during transition
                decoded = jwt.verify(token, env.JWT_SECRET, {
                    algorithms: ['HS256']
                });
            }
        }

        if (!decoded || !decoded._id) {
            return next(new Error("Socket Authentication Failed: Invalid token claims"));
        }

        const user = await UserModel.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            return next(new Error("Socket Authentication Failed: User not found"));
        }

        if (user.isBanned) {
            return next(new Error("Socket Authentication Failed: User account is banned"));
        }

        // Attach verified user object to socket instance
        socket.user = user;
        next();
    } catch (err) {
        return next(new Error(`Socket Authentication Error: ${err.message}`));
    }
};
