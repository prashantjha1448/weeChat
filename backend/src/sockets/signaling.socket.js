/**
 * WebRTC Signaling Socket Handler — Step 4 Realtime WebSockets
 * Handlers: webrtc:offer, webrtc:answer, webrtc:ice
 */
export const registerSignalingHandlers = (io, socket) => {
    const user = socket.user;

    // 1. Relay SDP Offer to Peer (Enforces room membership)
    socket.on('webrtc:offer', (data) => {
        const { roomId, offer } = data || {};
        if (!roomId || !offer || !socket.rooms.has(roomId)) return;
        console.log(`📤 Relaying WebRTC Offer from ${user.name} in Room ${roomId}`);
        socket.to(roomId).emit('webrtc:offer', {
            offer,
            senderId: user._id
        });
    });

    // 2. Relay SDP Answer to Caller Peer (Enforces room membership)
    socket.on('webrtc:answer', (data) => {
        const { roomId, answer } = data || {};
        if (!roomId || !answer || !socket.rooms.has(roomId)) return;
        console.log(`📥 Relaying WebRTC Answer from ${user.name} in Room ${roomId}`);
        socket.to(roomId).emit('webrtc:answer', {
            answer,
            senderId: user._id
        });
    });

    // 3. Relay ICE Candidates for NAT Traversal (Enforces room membership)
    socket.on('webrtc:ice', (data) => {
        const { roomId, candidate } = data || {};
        if (!roomId || !candidate || !socket.rooms.has(roomId)) return;
        socket.to(roomId).emit('webrtc:ice', {
            candidate,
            senderId: user._id
        });
    });
};
