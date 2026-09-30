import { io } from 'socket.io-client';

/**
 * Socket.io Client Service — Realtime Socket Connection Handler
 */
let socket = null;

export const initSocketClient = () => {
    if (!socket) {
        const getSocketUrl = () => {
            if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
            if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
            if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
                return 'https://weechat-api.onrender.com';
            }
            return 'http://localhost:3002';
        };

        socket = io(getSocketUrl(), {
            withCredentials: true,
            autoConnect: false
        });

        socket.on('connect', () => {
            console.log('Socket connected to server:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocketClient();
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) {
        s.connect();
    }
};

export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect();
    }
};
