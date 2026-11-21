import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (url && url.includes(',')) {
        url = url.split(',')[0];
    }
    if (!url || !url.trim()) {
        if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
            url = 'https://weechat-api.onrender.com/api/';
        } else {
            url = 'http://localhost:3002/api/';
        }
    }
    url = url.trim();
    if (!url.endsWith('/')) url += '/';
    if (!url.endsWith('api/')) {
        url += 'api/';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'weechat'
    }
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('admin_token') || localStorage.getItem('token')) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Resilient Fallback: If local backend is down, auto-retry against live Render API
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            (error.code === 'ERR_NETWORK' || !error.response) &&
            originalRequest &&
            !originalRequest._retryFallback &&
            typeof window !== 'undefined'
        ) {
            originalRequest._retryFallback = true;
            const liveUrl = 'https://weechat-api.onrender.com/api/';
            if (!originalRequest.baseURL?.includes('weechat-api.onrender.com')) {
                console.warn('[Admin API] Local port 3002 unreachable. Auto-routing to live API:', liveUrl);
                originalRequest.baseURL = liveUrl;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
