import { getSocket } from './socket.service';

/**
 * Default fallback STUN servers if backend is temporarily unreachable
 */
const DEFAULT_ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

let cachedConfig = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

/**
 * Fetch ICE (STUN/TURN) servers securely from backend
 * (Never exposed via frontend VITE_ variables)
 */
export const getIceServers = async () => {
    const now = Date.now();
    if (cachedConfig && now - lastFetchTime < CACHE_TTL_MS) {
        return cachedConfig;
    }

    // 1. Attempt retrieval via authenticated socket
    const socket = getSocket();
    if (socket && socket.connected) {
        try {
            const socketPromise = new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('Socket ICE request timed out')), 3000);
                socket.emit('get-ice-servers', (response) => {
                    clearTimeout(timer);
                    if (response && response.iceServers) {
                        resolve(response);
                    } else {
                        reject(new Error('Invalid socket ICE response'));
                    }
                });
            });

            const result = await socketPromise;
            cachedConfig = result;
            lastFetchTime = now;
            return cachedConfig;
        } catch (err) {
            console.warn('[WEBRTC] Socket ICE fetch failed, falling back to REST API:', err.message);
        }
    }

    // 2. Attempt retrieval via REST endpoint fallback
    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/call/ice-servers`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.iceServers) {
                cachedConfig = data;
                lastFetchTime = now;
                return cachedConfig;
            }
        }
    } catch (e) {
        console.warn('[WEBRTC] REST ICE fetch failed, using fallback Google STUN:', e.message);
    }

    // 3. Fallback
    return DEFAULT_ICE_SERVERS;
};
