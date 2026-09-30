import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (!url) {
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
        'X-Requested-With': 'nexus'
    }
});

export default api;