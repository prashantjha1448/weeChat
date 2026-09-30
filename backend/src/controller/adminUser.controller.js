import UserModel from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

// GET /api/admin/users (Search users)
export const searchUsersAdmin = async (req, res) => {
    const { query, role } = req.query;

    const filter = {};
    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ];
    }
    if (role) filter.role = role;

    const users = await UserModel.find(filter).select('-password -refreshToken').limit(50);
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
};

// PATCH /api/admin/users/:userId/role (Change User Role)
export const changeUserRoleAdmin = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
        throw new ApiError(400, "Invalid role specified");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('-password -refreshToken');

    return res.status(200).json(new ApiResponse(200, updatedUser, "User role updated successfully"));
};
