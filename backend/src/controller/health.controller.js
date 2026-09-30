import mongoose from 'mongoose';
import ApiResponse from '../utils/ApiResponse.js';

// GET /health — Liveness Check (Fast, No DB call)
export const getLivenessCheck = (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, { status: 'ok', timestamp: new Date().toISOString() }, 'Liveness check OK')
    );
};

// GET /ready — Readiness Check (Validates DB & Redis)
export const getReadinessCheck = async (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
        return res.status(503).json(
            new ApiResponse(530, { status: 'error', database: 'disconnected' }, 'Database not ready')
        );
    }

    return res.status(200).json(
        new ApiResponse(200, {
            status: 'ready',
            database: 'connected',
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString()
        }, 'Readiness check OK')
    );
};

export const getHealthCheck = getLivenessCheck;
