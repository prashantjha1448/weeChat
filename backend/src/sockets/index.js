import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { socketAuth } from '../middleware/socketAuth.middleware.js';
import { registerMatchmakingHandlers } from './matchmaking.socket.js';
import { registerSignalingHandlers } from './signaling.socket.js';
import { registerCallHandlers } from './call.socket.js';
import { registerChatHandlers } from './chat.socket.js';
import { registerPresenceHandlers } from './presence.socket.js';
import { registerCustomRoomHandlers } from './customRoom.socket.js';

/**
 * Strict Origin Validation for WebSockets (Prevents CSWSH)
 */
const isOriginAllowed = (origin) => {
    if (!origin) return true; // Direct non-browser clients or mobile apps

    // Check configured client URLs from environment
    if (env.parsedClientUrls && env.parsedClientUrls.includes(origin)) {
        return true;
    }

    // Local development origins
    if (env.NODE_ENV !== 'production') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return true;
        }
    }

    // Strict allowlist for production and project-specific preview domains
    if (origin === 'https://wee-chat-virid.vercel.app' || /^https:\/\/wee-chat[a-z0-9-]*\.vercel\.app$/.test(origin)) {
        return true;
    }

    return false;
};

/**
 * Master Socket.io Server Initialization — All Socket Handlers Registered
 */
export const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (isOriginAllowed(origin)) {
                    callback(null, true);
                } else {
                    console.warn(`[SOCKET CORS BLOCKED] Untrusted origin attempted connection: ${origin}`);
                    callback(new Error('CORS Access Denied: Origin not allowed on Socket server'), false);
                }
            },
            credentials: true
        }
    });


    // Mount Socket Authentication Middleware (Middleware 12)
    io.use(socketAuth);

    // Socket Connection Handler
    io.on('connection', (socket) => {
        console.log(`🔌 Socket Connected: ${socket.user.name} (Socket ID: ${socket.id})`);

        // Register All Socket Event Handlers
        registerMatchmakingHandlers(io, socket);
        registerSignalingHandlers(io, socket);
        registerCallHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerPresenceHandlers(io, socket);
        registerCustomRoomHandlers(io, socket);

        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket Disconnected: ${socket.user.name} (Reason: ${reason})`);
        });
    });

    return io;
};
