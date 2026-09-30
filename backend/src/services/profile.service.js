import ProfileModel from '../models/profile.model.js';
import UserModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Profile Service — Step 3: Service Layer (Decoupled Business Logic)
 */

// Fetch User Profile with fallback to User basic details
export const getUserProfileService = async (userId) => {
    let profile = await ProfileModel.findOne({ userId }).populate('userId', 'name username email gender dob avatar');

    if (!profile) {
        // Fallback initialization if profile doesn't exist yet
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        profile = await ProfileModel.create({
            userId: user._id,
            displayName: user.name,
            gender: user.gender,
            dob: user.dob
        });
    }

    return profile;
};

// Create or Update Profile details
export const createOrUpdateProfileService = async (userId, profileData) => {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true, upsert: true, runValidators: true }
    );

    return updatedProfile;
};
