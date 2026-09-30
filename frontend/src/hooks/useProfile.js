import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProfileApi,
    updateProfileApi,
    fetchPreferenceApi,
    updatePreferenceApi,
    fetchInterestsApi
} from '../services/profile.services';
import {
    setProfile,
    setPreference,
    setInterests,
    setProfileLoading,
    setProfileError
} from '../states/profileSlice';

/**
 * Custom Profile Hook — Step 7: Frontend Hook Layer
 */
export const useProfile = () => {
    const dispatch = useDispatch();
    const { profile, preference, interests, loading, error } = useSelector((state) => state.profile);

    const loadProfileAndPreferences = async () => {
        dispatch(setProfileLoading(true));
        try {
            const [profileRes, prefRes, tagsRes] = await Promise.all([
                fetchProfileApi(),
                fetchPreferenceApi(),
                fetchInterestsApi()
            ]);

            dispatch(setProfile(profileRes.data));
            dispatch(setPreference(prefRes.data));
            dispatch(setInterests(tagsRes.data));
        } catch (err) {
            dispatch(setProfileError(err?.response?.data?.message || "Failed to load profile data"));
        } finally {
            dispatch(setProfileLoading(false));
        }
    };

    const handleUpdateProfile = async (profileData) => {
        dispatch(setProfileLoading(true));
        try {
            const res = await updateProfileApi(profileData);
            dispatch(setProfile(res.data));
            return res.data;
        } catch (err) {
            dispatch(setProfileError(err?.response?.data?.message || "Failed to update profile"));
            throw err;
        } finally {
            dispatch(setProfileLoading(false));
        }
    };

    const handleUpdatePreference = async (preferenceData) => {
        dispatch(setProfileLoading(true));
        try {
            const res = await updatePreferenceApi(preferenceData);
            dispatch(setPreference(res.data));
            return res.data;
        } catch (err) {
            dispatch(setProfileError(err?.response?.data?.message || "Failed to update match preferences"));
            throw err;
        } finally {
            dispatch(setProfileLoading(false));
        }
    };

    return {
        profile,
        preference,
        interests,
        loading,
        error,
        loadProfileAndPreferences,
        handleUpdateProfile,
        handleUpdatePreference
    };
};
