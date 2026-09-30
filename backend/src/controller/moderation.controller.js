import ApiResponse from '../utils/ApiResponse.js';
import {
    applyModerationActionService,
    submitAppealService,
    getAuditLogsService
} from '../services/moderation.service.js';

// POST /api/moderation/action (Admin & Moderator protected)
export const applyModerationAction = async (req, res) => {
    const result = await applyModerationActionService(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, result, "Moderation action applied successfully"));
};

// POST /api/moderation/appeal
export const submitAppeal = async (req, res) => {
    const { moderationActionId, message } = req.body;
    const appeal = await submitAppealService(req.user._id, moderationActionId, message);
    return res.status(201).json(new ApiResponse(201, appeal, "Appeal submitted successfully"));
};

// GET /api/moderation/audits (Admin protected)
export const getAuditLogs = async (req, res) => {
    const logs = await getAuditLogsService();
    return res.status(200).json(new ApiResponse(200, logs, "Audit logs fetched successfully"));
};
