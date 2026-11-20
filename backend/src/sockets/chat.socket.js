import ChatMessageModel from '../models/chatMessage.model.js';

/**
 * In-Call Chat Socket Handler — Step 5 Realtime Sockets
 * Events: chat:send, chat:receive
 */
export const registerChatHandlers = (io, socket) => {
    const user = socket.user;

    socket.on('chat:send', async (data) => {
        const { roomId, sessionId, text } = data || {};

        if (!text || typeof text !== 'string' || !text.trim() || !roomId) return;

        // Verify that socket is actually a member of this room
        if (!socket.rooms.has(roomId)) {
            console.warn(`[CHAT BLOCKED] User ${user.name} attempted to send message to unjoined room: ${roomId}`);
            return;
        }

        // Cap message text length to 500 characters
        const trimmedText = text.trim().slice(0, 500);
        const timestamp = new Date().toISOString();

        console.log(`💬 In-Call Chat from ${user.name} in Room ${roomId}: "${trimmedText}"`);

        // Relay chat message to peer in room
        socket.to(roomId).emit('chat:receive', {
            senderId: user._id,
            senderName: user.name,
            text: trimmedText,
            timestamp
        });

        // Optionally persist chat log with 24-hour TTL expiry
        if (sessionId) {
            try {
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                await ChatMessageModel.create({
                    callSessionId: sessionId,
                    sender: user._id,
                    text: trimmedText,
                    expiresAt
                });
            } catch (err) {
                console.error("Chat message log error:", err);
            }
        }
    });
};
