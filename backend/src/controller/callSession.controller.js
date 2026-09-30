import ApiResponse from '../utils/ApiResponse.js';
import {
    startCallSessionService,
    endCallSessionService,
    getUserCallHistoryService
} from '../services/callSession.service.js';

/**
 * CallSession Controller — HTTP Handlers for Call Sessions
 */

// POST /api/call/start
export const startCall = async (req, res) => {
    const { peerUserId } = req.body;
    const session = await startCallSessionService(req.user._id, peerUserId);
    return res.status(201).json(new ApiResponse(201, session, "Call session started"));
};

// POST /api/call/end
export const endCall = async (req, res) => {
    const { sessionId, endReason } = req.body;
    const session = await endCallSessionService(sessionId, endReason);
    return res.status(200).json(new ApiResponse(200, session, "Call session ended"));
};

// GET /api/call/history
export const getCallHistory = async (req, res) => {
    const history = await getUserCallHistoryService(req.user._id);
    return res.status(200).json(new ApiResponse(200, history, "Call history fetched successfully"));
};
