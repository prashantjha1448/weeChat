import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import AuthSessionModel from '../models/authSession.model.js';
import { getRequestLocation } from '../utils/geoIp.js';
import crypto from 'crypto';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid admin email or password"
            });
        }

        if (user.role !== 'admin' && user.role !== 'moderator') {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Access Denied: This account does not have Admin or Moderator permissions"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid admin email or password"
            });
        }

        const token = jwt.sign(
            { _id: String(user._id), role: user.role },
            process.env.JWT_SECRET || '4638eba7436cd7a8fc62356843f368f370c9e57449c4869940c8a447b9094bf4',
            { expiresIn: '7d' }
        );

        // Record session
        try {
            const ua = req.headers['user-agent'] || 'Admin Web Portal';
            const { ip, location } = getRequestLocation(req);
            const refreshTokenHash = crypto.createHash('sha256').update(token).digest('hex');
            await AuthSessionModel.create({
                userId: user._id,
                refreshTokenHash,
                device: ua,
                ip,
                location,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } catch (sessErr) {
            console.warn("[Admin Session Log Notice]", sessErr.message);
        }

        const userObj = user.toObject();
        delete userObj.password;

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data: {
                user: userObj,
                accessToken: token
            },
            message: "Admin authenticated successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message || "Internal server error"
        });
    }
};

export const getAdminProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        statusCode: 200,
        data: req.user,
        message: "Current admin profile fetched"
    });
};
