import ApiResponse from '../utils/ApiResponse.js';
import {
    getUserSessionsService,
    revokeSessionService,
    logoutAllSessionsService
} from '../services/session.service.js';

// GET /api/sessions
export const getUserSessions = async (req, res) => {
    const sessions = await getUserSessionsService(req.user._id);
    return res.status(200).json(new ApiResponse(200, sessions, "User active sessions fetched"));
};

// DELETE /api/sessions/:sessionId
export const revokeSession = async (req, res) => {
    const { sessionId } = req.params;
    const session = await revokeSessionService(sessionId, req.user._id);
    return res.status(200).json(new ApiResponse(200, session, "Session revoked successfully"));
};

// POST /api/sessions/logout-all
export const logoutAllSessions = async (req, res) => {
    const result = await logoutAllSessionsService(req.user._id);
    return res.status(200).json(new ApiResponse(200, result, "Logged out from all active sessions"));
};
