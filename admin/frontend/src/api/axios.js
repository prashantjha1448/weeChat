import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_ADMIN_API_URL;
    if (url && url.includes(',')) {
        url = url.split(',')[0];
    }
    if (!url || !url.trim()) {
        if (typeof window !== 'undefined') {
            if (window.location.hostname.includes('vercel.app')) {
                url = 'https://weechat-api.onrender.com/api/';
            } else {
                url = `http://${window.location.hostname}:4000/api/`;
            }
        } else {
            url = 'http://localhost:4000/api/';
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
        'X-Requested-With': 'weechat-admin',
        'X-Admin-Client': 'weeChat-Admin-Web'
    }
});

api.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'weechat-admin';
    config.headers['X-Admin-Client'] = 'weeChat-Admin-Web';
    const token = typeof window !== 'undefined' ? (localStorage.getItem('admin_token') || localStorage.getItem('token')) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fallback: If port 4000 is unreachable, try port 3002 or live Render API
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
            const fallbackUrl = 'http://localhost:3002/api/';
            if (!originalRequest.baseURL?.includes('3002')) {
                console.warn('[Admin API] Dedicated Admin Backend (4000) unreachable. Attempting fallback to main backend:', fallbackUrl);
                originalRequest.baseURL = fallbackUrl;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
