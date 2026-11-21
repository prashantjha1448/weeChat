import api from './axios.js';

/**
 * Admin API Client — weeChat Dedicated Standalone Admin Portal
 */

// 1. Auth & Current Admin Profile
export const getAdminProfile = async () => {
    const res = await api.get('/auth/get-me');
    return res.data?.data;
};

export const adminLogin = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data?.data;
};

export const getAdminAuditLogs = async (params = {}) => {
    const res = await api.get('/auth/logs', { params });
    return res.data?.data;
};

// 2. Platform Analytics & Demographics
export const getAdminStats = async () => {
    const res = await api.get('/analytics/stats');
    return res.data?.data;
};

export const flushExpiredSessions = async () => {
    const res = await api.post('/analytics/flush-sessions');
    return res.data;
};

export const broadcastAnnouncement = async (title, message, priority = 'normal') => {
    const res = await api.post('/analytics/broadcast', { title, message, priority });
    return res.data;
};

// 3. User Management (CRUD)
export const getAdminUsers = async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data?.data;
};

export const createAdminUser = async (data) => {
    const res = await api.post('/users', data);
    return res.data?.data;
};

export const updateAdminUser = async (userId, data) => {
    const res = await api.put(`/users/${userId}`, data);
    return res.data?.data;
};

export const toggleBanUser = async (userId, isBanned, reason = '') => {
    const res = await api.patch(`/users/${userId}/ban`, { isBanned, reason });
    return res.data?.data;
};

export const deleteAdminUser = async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data?.data;
};

// 4. User Deep-Dive Inspector (Device/login history, locations, feature usage)
export const getUserDeepDive = async (userId) => {
    const res = await api.get(`/users/${userId}/deep-dive`);
    return res.data?.data;
};

export const revokeUserSession = async (userId, sessionId) => {
    const res = await api.delete(`/users/${userId}/sessions/${sessionId}`);
    return res.data?.data;
};

// 5. Client Queries & Support Resolver ("aur client ki querry resolve kreyga")
export const getSupportQueries = async (params = {}) => {
    const res = await api.get('/queries', { params });
    return res.data?.data;
};

export const resolveSupportQuery = async (ticketId, adminResponse, status = 'resolved') => {
    const res = await api.patch(`/queries/${ticketId}/resolve`, { adminResponse, status });
    return res.data?.data;
};

export const updateQueryStatus = async (ticketId, status) => {
    const res = await api.patch(`/queries/${ticketId}/status`, { status });
    return res.data?.data;
};

export const getAbuseReports = async (params = {}) => {
    const res = await api.get('/queries/reports', { params });
    return res.data?.data;
};

// 6. Website Ads Placements
export const getAdminAds = async () => {
    const res = await api.get('/ads');
    return res.data?.data;
};

export const updateAdminAds = async (placements) => {
    const res = await api.put('/ads', { placements });
    return res.data?.data;
};

export const toggleAdPlacement = async (placementId, isEnabled) => {
    const res = await api.patch(`/ads/${placementId}/toggle`, { isEnabled });
    return res.data?.data;
};

// 7. Payments & Transaction Logs
export const getAdminTransactions = async (params = {}) => {
    const res = await api.get('/transactions', { params });
    return res.data?.data;
};

export const createAdminTransaction = async (data) => {
    const res = await api.post('/transactions', data);
    return res.data?.data;
};

export const updateTransactionStatus = async (txId, status) => {
    const res = await api.patch(`/transactions/${txId}/status`, { status });
    return res.data?.data;
};
