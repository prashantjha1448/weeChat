import ApiError from '../utils/ApiError.js';

/**
 * Match Preference Validation — Pure JS Human-Readable Validation Layer
 * Standard Build Order: Step 2
 */
export const updatePreferenceSchema = {
    parse: (data) => {
        const { gender, targetLocationMode, interests, ageRange, minHeightCm, maxHeightCm } = data;

        if (gender && !['male', 'female', 'non_binary', 'lgbtq', 'other', 'any'].includes(gender)) {
            throw new ApiError(400, "Interested gender must be male, female, non_binary, lgbtq, other, or any");
        }

        if (targetLocationMode && !['anywhere', 'city', 'state', 'pincode', 'current_location', 'same_city', 'same_state'].includes(targetLocationMode)) {
            throw new ApiError(400, "Location mode must be anywhere, city, state, pincode, or current_location");
        }

        if (interests !== undefined) {
            if (!Array.isArray(interests)) {
                throw new ApiError(400, "Interests must be an array of string tags");
            }
            if (interests.length > 5) {
                throw new ApiError(400, "Maximum 5 interest tags allowed");
            }
        }

        if (ageRange !== undefined && typeof ageRange === 'object') {
            const { minAge, maxAge } = ageRange;
            if (minAge !== undefined && (minAge < 18 || minAge > 99)) {
                throw new ApiError(400, "Min age must be between 18 and 99");
            }
            if (maxAge !== undefined && (maxAge < 18 || maxAge > 99)) {
                throw new ApiError(400, "Max age must be between 18 and 99");
            }
            if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
                throw new ApiError(400, "Min age cannot be greater than max age");
            }
        }

        if (minHeightCm !== undefined && (minHeightCm < 100 || minHeightCm > 250)) {
            throw new ApiError(400, "Min height must be between 100cm and 250cm");
        }

        if (maxHeightCm !== undefined && (maxHeightCm < 100 || maxHeightCm > 250)) {
            throw new ApiError(400, "Max height must be between 100cm and 250cm");
        }

        return data;
    }
};
