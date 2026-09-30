import BlockModel from '../models/block.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Block Service — User Block List Logic
 */

export const blockUserService = async (blockerId, blockedUserId) => {
    if (blockerId.toString() === blockedUserId.toString()) {
        throw new ApiError(400, "You cannot block yourself");
    }

    const block = await BlockModel.findOneAndUpdate(
        { blocker: blockerId, blockedUser: blockedUserId },
        { blocker: blockerId, blockedUser: blockedUserId },
        { upsert: true, new: true }
    );

    return block;
};

export const unblockUserService = async (blockerId, blockedUserId) => {
    await BlockModel.findOneAndDelete({ blocker: blockerId, blockedUser: blockedUserId });
    return { success: true };
};

export const getMyBlockedUsersService = async (blockerId) => {
    const blocked = await BlockModel.find({ blocker: blockerId })
        .populate('blockedUser', 'name username avatar');

    return blocked;
};
