/**
 * Presence & Heartbeat Socket Handler — Step 5 Realtime Sockets
 * Events: heartbeat, user:online, user:offline
 */
export const registerPresenceHandlers = (io, socket) => {
    const user = socket.user;

    socket.on('heartbeat', () => {
        socket.emit('heartbeat:ack', { timestamp: Date.now() });
    });
};
