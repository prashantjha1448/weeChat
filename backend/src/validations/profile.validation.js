import ApiError from '../utils/ApiError.js';

/**
 * Profile Input Validation — Pure JS Human-Readable Validation Layer
 * Standard Build Order: Step 2
 */
export const updateProfileSchema = {
    parse: (data) => {
        const { displayName, gender, heightCm, bio, languages } = data;

        if (displayName && (displayName.length < 3 || displayName.length > 50)) {
            throw new ApiError(400, "Display name must be between 3 and 50 characters");
        }

        if (gender && !['male', 'female', 'other'].includes(gender)) {
            throw new ApiError(400, "Gender must be male, female, or other");
        }

        if (heightCm !== undefined && (heightCm < 100 || heightCm > 250)) {
            throw new ApiError(400, "Height must be between 100cm and 250cm");
        }

        if (bio && bio.length > 250) {
            throw new ApiError(400, "Bio cannot exceed 250 characters");
        }

        if (languages && !Array.isArray(languages)) {
            throw new ApiError(400, "Languages must be an array of strings");
        }

        return data;
    }
};
