import CallSessionModel from '../models/callSession.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * CallSession Service — Business Logic for 1-on-1 Video Call Sessions
 */

// Start a new Call Session between User A and User B
export const startCallSessionService = async (userAId, userBId) => {
    const session = await CallSessionModel.create({
        userA: userAId,
        userB: userBId,
        startedAt: new Date()
    });

    return session;
};

// End a Call Session with duration and end reason
export const endCallSessionService = async (sessionId, endReason = "user_skipped") => {
    const session = await CallSessionModel.findById(sessionId);
    if (!session) {
        throw new ApiError(404, "Call session not found");
    }

    const endedAt = new Date();
    const duration = Math.max(0, Math.floor((endedAt.getTime() - new Date(session.startedAt).getTime()) / 1000));

    session.endedAt = endedAt;
    session.duration = duration;
    session.endReason = endReason;
    await session.save();

    return session;
};

// Get User Call History Logs
export const getUserCallHistoryService = async (userId, limit = 20) => {
    const history = await CallSessionModel.find({
        $or: [{ userA: userId }, { userB: userId }]
    })
    .sort({ startedAt: -1 })
    .limit(limit)
    .populate('userA', 'name username avatar')
    .populate('userB', 'name username avatar');

    return history;
};
