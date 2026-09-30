import api from '../../api/axios';

/**
 * Settings API Module — REST endpoints for Nexus Settings
 */

// Preferences
export const getPreferencesApi = async () => {
    try {
        const res = await api.get('/preferences');
        return res.data;
    } catch {
        // Fallback to legacy user/preferences route if available
        const res = await api.get('/user/preferences');
        return res.data;
    }
};

export const updatePreferencesApi = async (data) => {
    try {
        const res = await api.patch('/preferences', data);
        return res.data;
    } catch {
        const res = await api.put('/user/preferences', data);
        return res.data;
    }
};

// Interests list
export const getInterestsApi = async () => {
    const res = await api.get('/interests');
    return res.data;
};

// Profile & Visibility Flags
export const getProfileApi = async () => {
    try {
        const res = await api.get('/profile');
        return res.data;
    } catch {
        const res = await api.get('/user/profile');
        return res.data;
    }
};

export const updateProfileVisibilityApi = async (visibilityData) => {
    try {
        const res = await api.patch('/profile', visibilityData);
        return res.data;
    } catch {
        const res = await api.put('/user/profile', visibilityData);
        return res.data;
    }
};

export const deleteAccountApi = async () => {
    const res = await api.delete('/profile');
    return res.data;
};

// Sessions
export const getSessionsApi = async () => {
    const res = await api.get('/sessions');
    return res.data;
};

export const revokeSessionApi = async (sessionId) => {
    const res = await api.delete(`/sessions/${sessionId}`);
    return res.data;
};

export const logoutAllSessionsApi = async () => {
    const res = await api.post('/sessions/logout-all');
    return res.data;
};

// Password Change
export const changePasswordApi = async (passwordData) => {
    const res = await api.patch('/auth/password', passwordData);
    return res.data;
};

// Blocked Users
export const getBlockedUsersApi = async () => {
    const res = await api.get('/blocks');
    return res.data;
};

export const unblockUserApi = async (userId) => {
    const res = await api.delete(`/blocks/${userId}`);
    return res.data;
};

// User Reports
export const getReportsApi = async () => {
    const res = await api.get('/reports');
    return res.data;
};

// Support Tickets
export const getSupportTicketsApi = async () => {
    const res = await api.get('/support/tickets');
    return res.data;
};

export const createSupportTicketApi = async (ticketData) => {
    const res = await api.post('/support/tickets', ticketData);
    return res.data;
};

// Notification Settings
export const getNotificationSettingsApi = async () => {
    const res = await api.get('/notifications/settings');
    return res.data;
};

export const updateNotificationSettingsApi = async (settingsData) => {
    const res = await api.patch('/notifications/settings', settingsData);
    return res.data;
};
