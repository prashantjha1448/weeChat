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

// Create or Update Match Preferences
export const createOrUpdatePreferenceService = async (userId, preferenceData) => {
    const updatedPreference = await MatchPreferenceModel.findOneAndUpdate(
        { userId },
        { $set: preferenceData },
        { new: true, upsert: true, runValidators: true }
    );

    return updatedPreference;
};
