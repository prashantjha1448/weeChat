import api from '../api/axios.js';

/**
 * Admin API Client — weeChat Admin Control Panel
 */

// 1. Analytics & Demographics
export const getAdminStats = async () => {
    const res = await api.get('/admin/stats');
    return res.data?.data;
};

// 2. User Management (CRUD)
export const getAdminUsers = async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data?.data;
};

export const createAdminUser = async (data) => {
    const res = await api.post('/admin/users', data);
    return res.data?.data;
};

export const updateAdminUser = async (userId, data) => {
    const res = await api.put(`/admin/users/${userId}`, data);
    return res.data?.data;
};

export const changeUserRole = async (userId, role) => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data?.data;
};

export const toggleBanUser = async (userId, isBanned, reason = '') => {
    const res = await api.patch(`/admin/users/${userId}/ban`, { isBanned, reason });
    return res.data?.data;
};

export const deleteAdminUser = async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data?.data;
};

// 3. User Deep-Dive Inspector (Device/login history, locations, feature usage)
export const getUserDeepDive = async (userId) => {
    const res = await api.get(`/admin/users/${userId}/deep-dive`);
    return res.data?.data;
};

export const revokeUserSession = async (userId, sessionId) => {
    const res = await api.delete(`/admin/users/${userId}/sessions/${sessionId}`);
    return res.data?.data;
};

// 4. Website Ads Placements
export const getAdminAds = async () => {
    const res = await api.get('/admin/ads');
    return res.data?.data;
};

export const updateAdminAds = async (placements) => {
    const res = await api.put('/admin/ads', { placements });
    return res.data?.data;
};

export const toggleAdPlacement = async (placementId, isEnabled) => {
    const res = await api.patch(`/admin/ads/${placementId}/toggle`, { isEnabled });
    return res.data?.data;
};

// 5. Payments & Transaction Logs
export const getAdminTransactions = async (params = {}) => {
    const res = await api.get('/admin/transactions', { params });
    return res.data?.data;
};

export const createAdminTransaction = async (data) => {
    const res = await api.post('/admin/transactions', data);
    return res.data?.data;
};

export const updateTransactionStatus = async (txId, status) => {
    const res = await api.patch(`/admin/transactions/${txId}/status`, { status });
    return res.data?.data;
};
