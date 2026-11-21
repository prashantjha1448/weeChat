import CustomRoomModel from '../models/customRoom.model.js';

/**
 * Custom Multi-Participant Room Socket Handlers (up to 100 people)
 * Real-time Video/Audio Mesh Signaling, Screen Sharing, Group Chat & Host Moderation
 */
export const registerCustomRoomHandlers = (io, socket) => {
    const user = socket.user;

    // 1. Join Room (Secured with Passcode Verification & Capacity Checks)
    socket.on('room:join', async ({ roomId, passcode }) => {
        if (!roomId) return;
        const cleanRoomId = String(roomId).trim().toUpperCase();

        try {
            const room = await CustomRoomModel.findOne({ roomId: cleanRoomId, isActive: true }).select('+passcode');
            if (!room) {
                socket.emit('room:error', { message: 'Room not found or has already ended.' });
                return;
            }

            const isHost = String(room.hostId) === String(user._id);
            const existingIdx = room.participants.findIndex(p => String(p.userId) === String(user._id));
            const isAlreadyParticipant = existingIdx !== -1;

            // Enforce passcode protection for private rooms
            if (room.isPrivate && !isHost && !isAlreadyParticipant) {
                if (!passcode || passcode !== room.passcode) {
                    socket.emit('room:error', { message: 'Access Denied: Invalid or missing room passcode.' });
                    return;
                }
            }

            // Enforce room capacity limits (up to maxParticipants, max 100)
            if (!isAlreadyParticipant && room.participants.length >= room.maxParticipants) {
                socket.emit('room:error', { message: `Room is full. Maximum limit of ${room.maxParticipants} participants reached.` });
                return;
            }

            const channelName = `custom_room_${cleanRoomId}`;
            socket.join(channelName);
            socket.currentRoomId = cleanRoomId;

            if (isAlreadyParticipant) {
                room.participants[existingIdx].socketId = socket.id;
            } else {
                room.participants.push({
                    userId: user._id,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar || '',
                    socketId: socket.id,
                    role: isHost ? 'host' : 'member',
                    isMuted: false,
                    isCameraOff: false,
                    isSharingScreen: false
                });
            }
            await room.save();

            // Broadcast updated participant list to all in room
            io.to(channelName).emit('room:participants-updated', {
                participants: room.participants,
                hostId: room.hostId
            });

            // Notify others that a new peer joined to trigger WebRTC offer creation
            socket.to(channelName).emit('room:user-joined', {
                userId: user._id,
                socketId: socket.id,
                name: user.name,
                username: user.username,
                avatar: user.avatar || ''
            });

            console.log(`👤 User ${user.name} joined Custom Room ${cleanRoomId} (Socket: ${socket.id})`);
        } catch (err) {
            console.error('[ROOM JOIN SOCKET ERROR]', err);
            socket.emit('room:error', { message: 'Failed to join room. Please try again.' });
        }
    });

    // Helper to verify target socket belongs to the same room
    const isTargetInSameRoom = (targetSocketId) => {
        if (!targetSocketId || !socket.currentRoomId) return false;
        const channelName = `custom_room_${socket.currentRoomId}`;
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        return Boolean(targetSocket && socket.rooms.has(channelName) && targetSocket.rooms.has(channelName));
    };

    // 2. Targeted WebRTC Offer (Restricted to verified room peers)
    socket.on('webrtc:room-offer', ({ targetSocketId, offer }) => {
        if (!isTargetInSameRoom(targetSocketId) || !offer) return;
        io.to(targetSocketId).emit('webrtc:room-offer', {
            senderSocketId: socket.id,
            senderUserId: user._id,
            senderName: user.name,
            offer
        });
    });

    // 3. Targeted WebRTC Answer (Restricted to verified room peers)
    socket.on('webrtc:room-answer', ({ targetSocketId, answer }) => {
        if (!isTargetInSameRoom(targetSocketId) || !answer) return;
        io.to(targetSocketId).emit('webrtc:room-answer', {
            senderSocketId: socket.id,
            answer
        });
    });

    // 4. Targeted WebRTC ICE Candidate (Restricted to verified room peers)
    socket.on('webrtc:room-ice', ({ targetSocketId, candidate }) => {
        if (!isTargetInSameRoom(targetSocketId) || !candidate) return;
        io.to(targetSocketId).emit('webrtc:room-ice', {
            senderSocketId: socket.id,
            candidate
        });
    });

    // 5. Media State Sync (Mute / Camera / Screen Share)
    socket.on('room:media-state-toggle', async ({ roomId, isMuted, isCameraOff, isSharingScreen }) => {
        if (!roomId) return;
        const channelName = `custom_room_${roomId.toUpperCase()}`;

        try {
            await CustomRoomModel.updateOne(
                { roomId: roomId.toUpperCase(), 'participants.userId': user._id },
                {
                    $set: {
                        'participants.$.isMuted': isMuted,
                        'participants.$.isCameraOff': isCameraOff,
                        'participants.$.isSharingScreen': isSharingScreen
                    }
                }
            );

            io.to(channelName).emit('room:media-state-changed', {
                socketId: socket.id,
                userId: user._id,
                isMuted,
                isCameraOff,
                isSharingScreen
            });
        } catch (err) {
            console.error('[ROOM MEDIA TOGGLE ERROR]', err);
        }
    });

    // 6. Group Text Messaging (Membership check & 500-char cap)
    socket.on('room:send-message', ({ roomId, message }) => {
        if (!roomId || !message || typeof message !== 'string' || !message.trim()) return;
        const cleanRoomId = roomId.trim().toUpperCase();
        if (socket.currentRoomId !== cleanRoomId) return; // Verify sender belongs to room

        const channelName = `custom_room_${cleanRoomId}`;
        const sanitizedText = message.trim().slice(0, 500);

        const msgObj = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            senderId: user._id,
            senderName: user.name,
            senderAvatar: user.avatar || '',
            text: sanitizedText,
            timestamp: new Date().toISOString()
        };

        io.to(channelName).emit('room:new-message', msgObj);
    });

    // 7. Host Kick User
    socket.on('room:kick-user', async ({ roomId, targetSocketId, targetUserId }) => {
        if (!roomId) return;
        const channelName = `custom_room_${roomId.toUpperCase()}`;

        try {
            const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase() });
            if (!room || String(room.hostId) !== String(user._id)) return; // Only host can kick

            room.participants = room.participants.filter(p => String(p.userId) !== String(targetUserId));
            await room.save();

            io.to(targetSocketId).emit('room:kicked', { message: 'You have been kicked by the host.' });
            io.to(channelName).emit('room:participants-updated', {
                participants: room.participants,
                hostId: room.hostId
            });
        } catch (err) {
            console.error('[ROOM KICK ERROR]', err);
        }
    });

    // 8. Leave Room
    const handleLeave = async (roomId) => {
        if (!roomId) return;
        const channelName = `custom_room_${roomId.toUpperCase()}`;
        socket.leave(channelName);

        try {
            const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase(), isActive: true });
            if (!room) return;

            room.participants = room.participants.filter(p => String(p.userId) !== String(user._id));

            // If host left and participants remain, transfer host to next participant; else end room
            if (String(room.hostId) === String(user._id)) {
                if (room.participants.length > 0) {
                    room.hostId = room.participants[0].userId;
                    room.participants[0].role = 'host';
                } else {
                    room.isActive = false;
                }
            }
            await room.save();

            io.to(channelName).emit('room:user-left', {
                socketId: socket.id,
                userId: user._id,
                name: user.name
            });

            io.to(channelName).emit('room:participants-updated', {
                participants: room.participants,
                hostId: room.hostId
            });
        } catch (err) {
            console.error('[ROOM LEAVE ERROR]', err);
        }
    };

    socket.on('room:leave', ({ roomId }) => {
        handleLeave(roomId);
    });

    // 9. Host End Room
    socket.on('room:end-room', async ({ roomId }) => {
        if (!roomId) return;
        const channelName = `custom_room_${roomId.toUpperCase()}`;

        try {
            const room = await CustomRoomModel.findOne({ roomId: roomId.toUpperCase() });
            if (!room || String(room.hostId) !== String(user._id)) return;

            room.isActive = false;
            room.participants = [];
            await room.save();

            io.to(channelName).emit('room:ended', { message: 'Room has been ended by the host.' });
        } catch (err) {
            console.error('[ROOM END ERROR]', err);
        }
    });

    // Handle Disconnect cleanup
    socket.on('disconnect', () => {
        if (socket.currentRoomId) {
            handleLeave(socket.currentRoomId);
        }
    });
};
