import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import UserModel from '../models/user.model.js';

/**
 * SocketAuth Middleware — Middleware 12
 * Verifies JWT token from handshake cookies/headers for Socket.io connections
 */
export const socketAuth = async (socket, next) => {
    try {
        const rawCookies = socket.handshake.headers.cookie;
        let token = null;

        if (rawCookies) {
            const parsedCookies = cookie.parse(rawCookies);
            token = parsedCookies.accessToken;
        }

        if (!token && socket.handshake.auth && socket.handshake.auth.token) {
            token = socket.handshake.auth.token;
        }

        if (!token) {
            return next(new Error("Socket Authentication Failed: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access_secret_123");
        const user = await UserModel.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            return next(new Error("Socket Authentication Failed: User not found"));
        }

        if (user.isBanned) {
            return next(new Error("Socket Authentication Failed: User account is banned"));
        }

        // Attach user object to socket instance
        socket.user = user;
        next();
    } catch (err) {
        return next(new Error(`Socket Authentication Error: ${err.message}`));
    }
};
