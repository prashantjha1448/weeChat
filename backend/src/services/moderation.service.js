import ModerationActionModel from '../models/moderationAction.model.js';
import BannedIdentifierModel from '../models/bannedIdentifier.model.js';
import AppealModel from '../models/appeal.model.js';
import AuditLogModel from '../models/auditLog.model.js';
import UserModel from '../models/user.model.js';

/**
 * Moderation & Security Service — Admin & Ban Governance
 */

// Apply Moderation Penalty (Warning, Temp Ban, Perm Ban)
export const applyModerationActionService = async (adminId, actionData) => {
    const { targetUserId, type, reason, durationDays, ipToBan, deviceToBan } = actionData;

    let expiresAt = null;
    if (type === "temp_ban" && durationDays) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);
    }

    const action = await ModerationActionModel.create({
        targetUser: targetUserId,
        type,
        reason,
        expiresAt,
        actionBy: adminId
    });

    if (type === "perm_ban" || type === "temp_ban") {
        await UserModel.findByIdAndUpdate(targetUserId, { isBanned: true });
    }

    if (ipToBan) {
        await BannedIdentifierModel.findOneAndUpdate(
            { value: ipToBan },
            { type: "ip", value: ipToBan, reason, expiresAt },
            { upsert: true }
        );
    }

    if (deviceToBan) {
        await BannedIdentifierModel.findOneAndUpdate(
            { value: deviceToBan },
            { type: "device_fingerprint", value: deviceToBan, reason, expiresAt },
            { upsert: true }
        );
    }

    // Record Audit Log
    await AuditLogModel.create({
        actor: adminId,
        action: `MODERATION_${type.toUpperCase()}`,
        target: targetUserId.toString(),
        metadata: { reason, durationDays, ipToBan, deviceToBan }
    });

    return action;
};

// Submit Appeal for Banned Users
export const submitAppealService = async (userId, moderationActionId, message) => {
    const appeal = await AppealModel.create({
        userId,
        moderationActionId,
        message
    });

    return appeal;
};

// Fetch System Audit Logs for Admins
export const getAuditLogsService = async (limit = 50) => {
    const logs = await AuditLogModel.find()
        .populate('actor', 'name username email role')
        .sort({ createdAt: -1 })
        .limit(limit);

    return logs;
};
