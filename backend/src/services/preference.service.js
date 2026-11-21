import MatchPreferenceModel from '../models/matchPreference.model.js';

/**
 * Match Preference Service — Step 3: Service Layer (Decoupled Business Logic)
 */

// Fetch User Match Preferences
export const getUserPreferenceService = async (userId) => {
    let preference = await MatchPreferenceModel.findOne({ userId });

    if (!preference) {
        preference = await MatchPreferenceModel.create({
            userId,
            gender: "any",
            targetLocationMode: "anywhere",
            interests: ["interest_tech", "interest_gaming"]
        });
    }

    return preference;
};

// Create or Update Match Preferences (Mass-Assignment Protected)
export const createOrUpdatePreferenceService = async (userId, preferenceData = {}) => {
    const safePayload = {};
    const allowedKeys = ['gender', 'targetLocationMode', 'interests'];

    for (const key of allowedKeys) {
        if (preferenceData[key] !== undefined) {
            safePayload[key] = preferenceData[key];
        }
    }

    const updatedPreference = await MatchPreferenceModel.findOneAndUpdate(
        { userId },
        { $set: safePayload },
        { new: true, upsert: true, runValidators: true }
    );

    return updatedPreference;
};
