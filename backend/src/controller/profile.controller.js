import ApiResponse from '../utils/ApiResponse.js';
import { getUserProfileService, createOrUpdateProfileService } from '../services/profile.service.js';
import { getUserPreferenceService, createOrUpdatePreferenceService } from '../services/preference.service.js';
import InterestModel from '../models/interest.model.js';

/**
 * Profile & Preference Controllers — Step 4: Controllers + Routes
 */

// GET /api/v1/profile
export const getProfile = async (req, res) => {
    const profile = await getUserProfileService(req.user._id);
    return res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
};

// PUT /api/v1/profile
export const updateProfile = async (req, res) => {
    const updatedProfile = await createOrUpdateProfileService(req.user._id, req.body);
    return res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
};

// GET /api/v1/preferences
export const getPreference = async (req, res) => {
    const preference = await getUserPreferenceService(req.user._id);
    return res.status(200).json(new ApiResponse(200, preference, "Matching preferences fetched successfully"));
};

// PUT /api/v1/preferences
export const updatePreference = async (req, res) => {
    const updatedPreference = await createOrUpdatePreferenceService(req.user._id, req.body);
    return res.status(200).json(new ApiResponse(200, updatedPreference, "Matching preferences updated successfully"));
};

// GET /api/v1/interests (Master Tag Seeding Listing)
export const getInterests = async (req, res) => {
    const interests = await InterestModel.find({ isActive: true }).select('type name code');
    return res.status(200).json(new ApiResponse(200, interests, "Active tags fetched successfully"));
};
