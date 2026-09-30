import AuthSessionModel from '../models/authSession.model.js';

/**
 * Session Service — Multi-Device Session Management
 */

export const getUserSessionsService = async (userId) => {
    const sessions = await AuthSessionModel.find({ userId, revokedAt: null })
        .sort({ updatedAt: -1 });

    return sessions;
};

export const revokeSessionService = async (sessionId, userId) => {
    const session = await AuthSessionModel.findOneAndUpdate(
        { _id: sessionId, userId },
        { revokedAt: new Date() },
        { new: true }
    );

    return session;
};

export const logoutAllSessionsService = async (userId) => {
    await AuthSessionModel.updateMany(
        { userId, revokedAt: null },
        { revokedAt: new Date() }
    );

    return { success: true };
};
