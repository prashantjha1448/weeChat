import ApiResponse from '../utils/ApiResponse.js';
import {
    blockUserService,
    unblockUserService,
    getMyBlockedUsersService
} from '../services/block.service.js';

// POST /api/block
export const blockUser = async (req, res) => {
    const { blockedUserId } = req.body;
    const result = await blockUserService(req.user._id, blockedUserId);
    return res.status(200).json(new ApiResponse(200, result, "User blocked successfully"));
};

// DELETE /api/block/:blockedUserId
export const unblockUser = async (req, res) => {
    const { blockedUserId } = req.params;
    const result = await unblockUserService(req.user._id, blockedUserId);
    return res.status(200).json(new ApiResponse(200, result, "User unblocked successfully"));
};

// GET /api/block/my-blocked
export const getMyBlockedUsers = async (req, res) => {
    const blockedList = await getMyBlockedUsersService(req.user._id);
    return res.status(200).json(new ApiResponse(200, blockedList, "Blocked users list fetched"));
};
