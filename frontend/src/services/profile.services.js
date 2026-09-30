import api from '../api/axios';

/**
 * Profile & Preference API Services — Step 7: Frontend API Layer
 */

// Fetch User Profile
export const fetchProfileApi = async () => {
    const response = await api.get('user/profile');
    return response.data;
};

// Update User Profile
export const updateProfileApi = async (profileData) => {
    const response = await api.put('user/profile', profileData);
    return response.data;
};

// Fetch User Match Preferences
export const fetchPreferenceApi = async () => {
    const response = await api.get('user/preferences');
    return response.data;
};

// Update User Match Preferences
export const updatePreferenceApi = async (preferenceData) => {
    const response = await api.put('user/preferences', preferenceData);
    return response.data;
};

// Fetch Active Tags (Interests, Languages, Countries)
export const fetchInterestsApi = async () => {
    const response = await api.get('user/interests');
    return response.data;
};
