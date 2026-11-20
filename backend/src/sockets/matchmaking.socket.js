import {
    addToMatchQueue,
    removeFromMatchQueue,
    tryImmediateMatch,
    getMatchQueueSize
} from '../services/matchmaking.service.js';

/**
 * Matchmaking Socket Handler — High-Speed Instant Shuffle
 * Events: queue:join, queue:leave, match:found
 */
export const registerMatchmakingHandlers = (io, socket) => {
    const user = socket.user;
    const userIdStr = user._id.toString();

    // 1. Join Queue Event (Start Random Video Chat)
    socket.on('queue:join', () => {
        try {
            console.log(`📡 [QUEUE:JOIN] ${user.name} (@${user.username}) joined matchmaking`);
            addToMatchQueue(user, socket.id);

            socket.emit('queue:status', {
                status: 'waiting',
                message: 'Looking for someone online to match with...'
            });

            // Attempt instant match with any currently waiting candidate
            const matched = tryImmediateMatch(io, user._id);
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
        console.log(`🚪 [QUEUE:LEAVE] User ${user.name} left queue`);
        removeFromMatchQueue(user._id);
        socket.emit('queue:status', { status: 'idle', message: 'Left queue' });
    });

    // 3. Socket Disconnect Clean-up
    socket.on('disconnect', () => {
        removeFromMatchQueue(user._id);
    });
};
