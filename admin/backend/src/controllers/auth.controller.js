import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/admin.model.js';
import AdminLogModel from '../models/adminLog.model.js';
import { getRequestLocation, parseUserAgent } from '../utils/geoIp.js';

/**
 * Admin Authentication Controller
 * Authenticates exclusively against the dedicated `admins` collection
 * Records all activities in the dedicated `admin_logs` collection
 */

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Admin email and password are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const { ip, location } = getRequestLocation(req);
        const ua = req.headers['user-agent'] || 'Admin Web Portal';
        const uaMeta = parseUserAgent(ua);

        // Find strictly in the dedicated `admins` collection
        const admin = await AdminModel.findOne({ email: cleanEmail }).select('+password');

        if (!admin) {
            // Log failed login attempt
            try {
                await AdminLogModel.create({
                    adminId: null,
                    adminEmail: cleanEmail,
                    adminName: 'Unknown',
                    action: 'LOGIN_ATTEMPT',
                    ip,
                    device: `${uaMeta.os} • ${uaMeta.browser} (${uaMeta.deviceType})`,
                    location,
                    status: 'failed',
                    details: { reason: 'Admin account not found in admins collection' }
                });
            } catch (e) {}

            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid admin email or password"
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Admin account is deactivated. Contact the system administrator."
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            try {
                await AdminLogModel.create({
                    adminId: admin._id,
                    adminEmail: admin.email,
                    adminName: admin.name,
                    action: 'LOGIN_ATTEMPT',
                    ip,
                    device: `${uaMeta.os} • ${uaMeta.browser} (${uaMeta.deviceType})`,
                    location,
                    status: 'failed',
                    details: { reason: 'Password mismatch' }
                });
            } catch (e) {}

            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid admin email or password"
            });
        }

        // Generate isolated admin access token
        const token = jwt.sign(
            {
                _id: String(admin._id),
                role: admin.role,
                type: 'admin',
                email: admin.email
            },
            process.env.JWT_SECRET || '4638eba7436cd7a8fc62356843f368f370c9e57449c4869940c8a447b9094bf4',
            { expiresIn: '7d' }
        );

        // Update admin last login
        admin.lastLoginAt = new Date();
        admin.lastLoginIp = ip;
        await admin.save();

        // Record dedicated admin audit log
        try {
            await AdminLogModel.create({
                adminId: admin._id,
                adminEmail: admin.email,
                adminName: admin.name,
                action: 'LOGIN',
                ip,
                device: `${uaMeta.os} • ${uaMeta.browser} (${uaMeta.deviceType})`,
                location,
                status: 'success',
                details: { role: admin.role, userAgent: ua }
            });
        } catch (logErr) {
            console.warn('[Admin Audit Log Notice]', logErr.message);
        }

        const adminObj = admin.toObject();
        delete adminObj.password;

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
                user: adminObj,
                accessToken: token
            },
            message: "Admin authenticated successfully"
        });
    } catch (err) {
        console.error('[Admin Login Error]:', err);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message || "Internal server error during admin login"
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

export const getAdminAuditLogs = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const logs = await AdminLogModel.find()
            .sort({ createdAt: -1 })
            .limit(Math.min(100, Math.max(1, parseInt(limit, 10) || 50)));

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data: logs,
            message: "Admin audit logs retrieved"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message
        });
    }
};
