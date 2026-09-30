import { Server } from 'socket.io';
import { socketAuth } from '../middleware/socketAuth.middleware.js';
import { registerMatchmakingHandlers } from './matchmaking.socket.js';
import { registerSignalingHandlers } from './signaling.socket.js';
import { registerCallHandlers } from './call.socket.js';
import { registerChatHandlers } from './chat.socket.js';
import { registerPresenceHandlers } from './presence.socket.js';
import { registerCustomRoomHandlers } from './customRoom.socket.js';

const allowedOrigins = [
    'http://localhost:5173',
    'https://wee-chat-virid.vercel.app',
    ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : [])
];

/**
 * Master Socket.io Server Initialization — All Socket Handlers Registered
 */
export const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                    callback(null, true);
                } else {
                    callback(null, true);
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
