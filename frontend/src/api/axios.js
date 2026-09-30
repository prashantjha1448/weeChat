import axios from 'axios';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return 'https://weechat-api.onrender.com/api/';
    }
    return 'http://localhost:3002/api/';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'nexus'
    }
});

export default api;