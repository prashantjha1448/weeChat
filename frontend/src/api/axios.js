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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;