import { endCallSessionService } from '../services/callSession.service.js';

/**
 * Call State & Skip Socket Handler — Step 4 Realtime Sockets
 * Events: call:skip, call:end, call:disconnect
 */
export const registerCallHandlers = (io, socket) => {
    const user = socket.user;

    // 1. Instant Call Skip / Next
    socket.on('call:skip', async (data) => {
        const { roomId, sessionId } = data || {};
        console.log(`⏭️ Call Skipped by ${user.name} in Room ${roomId}`);

        if (sessionId) {
            try {
                await endCallSessionService(sessionId, "user_skipped");
            } catch (err) {
                console.error("Error ending call session:", err);
            }
        }

        if (roomId) {
            // Notify peer in the room that user skipped
            socket.to(roomId).emit('call:peer_skipped', {
                message: "Peer skipped the conversation",
                skippedBy: user._id
            });
            socket.leave(roomId);
        }
    });

    // 2. Call End
    socket.on('call:end', async (data) => {
        const { roomId, sessionId } = data || {};
        console.log(`🛑 Call Ended by ${user.name} in Room ${roomId}`);

        if (sessionId) {
            try {
                await endCallSessionService(sessionId, "user_disconnected");
            } catch (err) {
                console.error("Error ending call session:", err);
            }
        }

        if (roomId) {
            socket.to(roomId).emit('call:ended', { message: "Call has ended" });
            socket.leave(roomId);
        }
    });
};
