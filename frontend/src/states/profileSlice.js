import { createSlice } from '@reduxjs/toolkit';

/**
 * Profile & Preference Redux Slice — Step 7: Frontend State Management
 */
const initialState = {
    profile: null,
    preference: null,
    interests: [],
    loading: false,
    error: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setPreference: (state, action) => {
            state.preference = action.payload;
        },
        setInterests: (state, action) => {
            state.interests = action.payload;
        },
        setProfileLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProfileError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setProfile,
    setPreference,
    setInterests,
    setProfileLoading,
    setProfileError
} = profileSlice.actions;

export default profileSlice.reducer;
