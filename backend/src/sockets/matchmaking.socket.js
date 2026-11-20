import {
    addToMatchQueue,
    removeFromMatchQueue,
    tryImmediateMatch,
    getMatchQueueSize
} from '../services/matchmaking.service.js';

/**
 * Matchmaking Socket Handler — High-Speed Instant Shuffle (<100ms)
 * Events: queue:join, queue:leave, match:found
 */
export const registerMatchmakingHandlers = (io, socket) => {
    const user = socket.user;

    // 1. Join Queue Event (Start Random Video Chat)
    socket.on('queue:join', () => {
        try {
            console.log(`📡 [QUEUE:JOIN] ${user.name} (@${user.username}) joined matchmaking (Socket: ${socket.id})`);
            addToMatchQueue(user, socket.id);

            socket.emit('queue:status', {
                status: 'waiting',
                message: 'Looking for someone online to match with...'
            });

            // Attempt instant 0ms match with any currently waiting candidate
            const matched = tryImmediateMatch(io, socket.id);
            if (!matched) {
                console.log(`⏳ [QUEUE:WAITING] User ${user.name} waiting in pool (Pool size: ${getMatchQueueSize()})`);
            }
        } catch (err) {
            console.error("Queue Join Error:", err);
            socket.emit('queue:error', { message: err.message });
        }
    });

    // 2. Leave Queue Event
    socket.on('queue:leave', () => {
        console.log(`🚪 [QUEUE:LEAVE] User ${user.name} left queue (Socket: ${socket.id})`);
        removeFromMatchQueue(socket.id);
        socket.emit('queue:status', { status: 'idle', message: 'Left queue' });
    });

    // 3. Socket Disconnect Clean-up
    socket.on('disconnect', () => {
        removeFromMatchQueue(socket.id);
    });
};
