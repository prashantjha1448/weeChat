import {
    addToMatchQueue,
    removeFromMatchQueue,
    findBestMatchInQueue
} from '../services/matchmaking.service.js';

/**
 * Matchmaking Socket Handler — Step 3 Realtime Sockets
 * Events: queue:join, queue:leave, match:found
 */
export const registerMatchmakingHandlers = (io, socket) => {
    const user = socket.user;
    const userIdStr = user._id.toString();

    // 1. Join Queue Event
    socket.on('queue:join', async () => {
        try {
            console.log(`📡 User joined queue: ${user.name} (@${user.username})`);
            await addToMatchQueue(user, socket.id);

            socket.emit('queue:status', { status: 'waiting', message: 'Searching for best match...' });

            // Check if immediate match is available in candidate pool
            const matchResult = findBestMatchInQueue(user._id);

            if (matchResult) {
                const { opponent, matchScore } = matchResult;

                // Remove both users from waiting queue
                removeFromMatchQueue(user._id);
                removeFromMatchQueue(opponent.user._id);

                // Generate a unique 1-on-1 WebRTC Call Room ID
                const roomId = `room_${Date.now()}_${user._id.toString().slice(-4)}_${opponent.user._id.toString().slice(-4)}`;

                // Get opponent socket instance
                const opponentSocket = io.sockets.sockets.get(opponent.socketId);

                // Join both sockets to the WebRTC Call Room
                socket.join(roomId);
                if (opponentSocket) opponentSocket.join(roomId);

                // Emit match:found to Peer A
                socket.emit('match:found', {
                    roomId,
                    matchScore,
                    isCaller: true, // Caller initiates WebRTC offer
                    peer: {
                        userId: opponent.user._id,
                        name: opponent.user.name,
                        username: opponent.user.username,
                        gender: opponent.user.gender,
                        avatar: opponent.profile?.avatar || "",
                        city: opponent.profile?.city || ""
                    }
                });

                // Emit match:found to Peer B
                if (opponentSocket) {
                    opponentSocket.emit('match:found', {
                        roomId,
                        matchScore,
                        isCaller: false, // Answerer waits for offer
                        peer: {
                            userId: user._id,
                            name: user.name,
                            username: user.username,
                            gender: user.gender,
                            avatar: socket.profile?.avatar || "",
                            city: socket.profile?.city || ""
                        }
                    });
                }

                console.log(`🎉 Match Found! Room: ${roomId} | Score: ${matchScore} | ${user.name} <-> ${opponent.user.name}`);
            }
        } catch (err) {
            console.error("Queue Join Error:", err);
            socket.emit('queue:error', { message: err.message });
        }
    });

    // 2. Leave Queue Event
    socket.on('queue:leave', () => {
        console.log(`🚪 User left queue: ${user.name}`);
        removeFromMatchQueue(user._id);
        socket.emit('queue:status', { status: 'idle', message: 'Left queue' });
    });

    // 3. Socket Disconnect Clean-up
    socket.on('disconnect', () => {
        removeFromMatchQueue(user._id);
    });
};
