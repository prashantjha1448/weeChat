import { slotMatchmakingService } from '../services/slotMatchmaking.service.js';
import ReportModel from '../models/report.model.js';
import { getIceServersConfig } from '../config/webrtc.config.js';

// Global map tracking active user socket IDs: userId -> socketId
const connectedUserSockets = new Map();

/**
 * Multi-Slot Video Chat Socket.IO Handlers (Slots 1..3)
 * Pure signaling relay + Redis atomic matchmaking integration
 */
export const registerMultiSlotHandlers = (io, socket) => {
    const user = socket.user;
    const userId = String(user._id);

    // Track user socket
    connectedUserSockets.set(userId, socket.id);

    // Map of active slot data on this socket: slotNumber (1..3) -> { roomId, peerId, peerSlot }
    socket.activeSlots = socket.activeSlots || new Map();

    /**
     * Helper to clean up an active slot connection
     */
    const handleLeaveSlot = async (slotNum) => {
        const slotData = socket.activeSlots.get(slotNum);
        const peerId = slotData?.peerId || null;
        const roomId = slotData?.roomId || null;
        const peerSlot = slotData?.peerSlot || null;

        // Clean slot in Redis
        await slotMatchmakingService.leaveSlot(userId, slotNum, peerId);

        if (roomId) {
            // Notify peer in that room that this slot left
            socket.to(roomId).emit('peer-left', {
                slot: peerSlot,
                roomId,
                peerId: userId
            });
            socket.leave(roomId);
        }

        socket.activeSlots.delete(slotNum);
    };

    /**
     * Helper to execute match search for a specific slot
     */
    const handleFindMatch = async (slotNum) => {
        try {
            const matchResult = await slotMatchmakingService.findMatch(userId, slotNum);

            if (!matchResult) {
                // No candidate ready; placed into Redis waiting set
                socket.emit('slot-waiting', { slot: slotNum, message: 'Searching for stranger...' });
                return;
            }

            const { peerId, peerSlot } = matchResult;
            const peerSocketId = connectedUserSockets.get(peerId);
            const peerSocket = peerSocketId ? io.sockets.sockets.get(peerSocketId) : null;

            // If opponent disconnected unexpectedly, clean up dead peer slot and retry
            if (!peerSocket || !peerSocket.connected) {
                console.warn(`[MULTI-SLOT] Peer ${peerId} socket is dead. Retrying match for user ${userId}.`);
                await slotMatchmakingService.leaveSlot(peerId, peerSlot, userId);
                return handleFindMatch(slotNum);
            }

            // Create unique signaling room for this slot pairing
            const roomId = `multislot_${Date.now()}_${userId}_${peerId}_s${slotNum}_s${peerSlot}`;

            socket.join(roomId);
            peerSocket.join(roomId);

            // Save active slot records on both sockets
            socket.activeSlots.set(slotNum, { roomId, peerId, peerSlot });
            peerSocket.activeSlots.set(peerSlot, { roomId, peerId: userId, peerSlot: slotNum });

            // Initiator is true ONLY for the searching peer who triggered the match
            socket.emit('matched', {
                peerId,
                peerSlot,
                roomId,
                slot: slotNum,
                initiator: true
            });

            // Initiator is false for the candidate waiting in the pool
            peerSocket.emit('matched', {
                peerId: userId,
                peerSlot: slotNum,
                roomId,
                slot: peerSlot,
                initiator: false
            });

            console.log(`🎉 [MULTI-SLOT MATCH] User ${userId} (slot ${slotNum}) <-> User ${peerId} (slot ${peerSlot}) in ${roomId}`);
        } catch (err) {
            console.error('[MULTI-SLOT MATCH ERROR]', err.message);
            socket.emit('slot-error', { slot: slotNum, message: err.message });
        }
    };

    // Expose handleFindMatch on socket so peer disconnect can put freed slot back into matching
    socket.handleFindMatch = handleFindMatch;

    // 1. Find Match on Slot (1..3)
    socket.on('find-match', async (data) => {
        const slotNum = Number(data?.slot);
        if (![1, 2, 3].includes(slotNum)) {
            return socket.emit('slot-error', { slot: data?.slot, message: 'Invalid slot. Must be 1, 2, or 3.' });
        }

        // Leave existing session on this slot if currently connected
        if (socket.activeSlots.has(slotNum)) {
            await handleLeaveSlot(slotNum);
        }

        await handleFindMatch(slotNum);
    });

    // 2. WebRTC Offer (Relay only, verifies room membership and slot mapping)
    socket.on('offer', ({ roomId, offer, slot }) => {
        const slotNum = Number(slot);
        if (![1, 2, 3].includes(slotNum) || !roomId) {
            return socket.emit('slot-error', { slot, message: 'Invalid slot or roomId for offer' });
        }

        const activeSlot = socket.activeSlots?.get(slotNum);
        if (!socket.rooms.has(roomId) || !activeSlot || activeSlot.roomId !== roomId) {
            console.warn(`[MULTI-SLOT BLOCKED] Unauthorized offer on unjoined/mismatched room: ${roomId}`);
            return socket.emit('slot-error', { roomId, slot: slotNum, message: 'Unauthorized: Sender is not in the specified roomId for this slot' });
        }

        slotMatchmakingService.refreshActiveTTL(userId).catch(() => {});
        socket.to(roomId).emit('offer', { roomId, offer, slot: slotNum });
    });

    // 3. WebRTC Answer (Relay only, verifies room membership and slot mapping)
    socket.on('answer', ({ roomId, answer, slot }) => {
        const slotNum = Number(slot);
        if (![1, 2, 3].includes(slotNum) || !roomId) {
            return socket.emit('slot-error', { slot, message: 'Invalid slot or roomId for answer' });
        }

        const activeSlot = socket.activeSlots?.get(slotNum);
        if (!socket.rooms.has(roomId) || !activeSlot || activeSlot.roomId !== roomId) {
            console.warn(`[MULTI-SLOT BLOCKED] Unauthorized answer on unjoined/mismatched room: ${roomId}`);
            return socket.emit('slot-error', { roomId, slot: slotNum, message: 'Unauthorized: Sender is not in the specified roomId for this slot' });
        }

        slotMatchmakingService.refreshActiveTTL(userId).catch(() => {});
        socket.to(roomId).emit('answer', { roomId, answer, slot: slotNum });
    });

    // 4. WebRTC ICE Candidate (Relay only, verifies room membership and slot mapping)
    socket.on('ice-candidate', ({ roomId, candidate, slot }) => {
        const slotNum = Number(slot);
        if (![1, 2, 3].includes(slotNum) || !roomId) {
            return socket.emit('slot-error', { slot, message: 'Invalid slot or roomId for ice-candidate' });
        }

        const activeSlot = socket.activeSlots?.get(slotNum);
        if (!socket.rooms.has(roomId) || !activeSlot || activeSlot.roomId !== roomId) {
            console.warn(`[MULTI-SLOT BLOCKED] Unauthorized ICE candidate on unjoined/mismatched room: ${roomId}`);
            return socket.emit('slot-error', { roomId, slot: slotNum, message: 'Unauthorized: Sender is not in the specified roomId for this slot' });
        }

        slotMatchmakingService.refreshActiveTTL(userId).catch(() => {});
        socket.to(roomId).emit('ice-candidate', { roomId, candidate, slot: slotNum });
    });

    // 4b. WebRTC ICE Restart Request (Non-initiator asks initiator to restart ICE)
    socket.on('request-restart', ({ roomId, slot }) => {
        const slotNum = Number(slot);
        if (![1, 2, 3].includes(slotNum) || !roomId) return;
        if (!socket.rooms.has(roomId)) return;

        socket.to(roomId).emit('request-restart', { roomId, slot: slotNum });
    });

    // 4c. Fetch WebRTC ICE Servers (STUN/TURN) Config
    socket.on('get-ice-servers', (callback) => {
        const config = getIceServersConfig(userId);
        if (typeof callback === 'function') {
            callback(config);
        } else {
            socket.emit('ice-servers', config);
        }
    });

    // 5. Next (Close connection on slot and re-enter matching for that slot only)
    socket.on('next', async (data) => {
        const slotNum = Number(data?.slot);
        if (![1, 2, 3].includes(slotNum)) {
            return socket.emit('slot-error', { slot: data?.slot, message: 'Invalid slot. Must be 1, 2, or 3.' });
        }

        await handleLeaveSlot(slotNum);
        await handleFindMatch(slotNum);
    });

    // 6. Leave Slot
    socket.on('leave-slot', async (data) => {
        const slotNum = Number(data?.slot);
        if (![1, 2, 3].includes(slotNum)) {
            return socket.emit('slot-error', { slot: data?.slot, message: 'Invalid slot. Must be 1, 2, or 3.' });
        }

        await handleLeaveSlot(slotNum);
        socket.emit('slot-idle', { slot: slotNum });
    });

    // 7. Report Peer on Slot
    socket.on('report', async (data) => {
        const slotNum = Number(data?.slot);
        const peerId = data?.peerId ? String(data.peerId) : null;

        if (![1, 2, 3].includes(slotNum) || !peerId) {
            return socket.emit('slot-error', { slot: data?.slot, message: 'Invalid slot or peerId for report.' });
        }

        try {
            await slotMatchmakingService.reportPeer(userId, peerId);

            // Log for moderation
            await ReportModel.create({
                reporter: user._id,
                reportedUser: peerId,
                reason: data?.reason || 'other',
                details: data?.details || 'Reported during multi-slot chat session'
            });
            console.log(`🚨 [MULTI-SLOT REPORT] User ${userId} blocked & reported peer ${peerId}`);
        } catch (err) {
            console.error('[MULTI-SLOT REPORT ERROR]', err.message);
        }

        // Advance slot to next stranger
        await handleLeaveSlot(slotNum);
        await handleFindMatch(slotNum);
    });

    // 8. Disconnect Cleanup
    socket.on('disconnect', async () => {
        if (connectedUserSockets.get(userId) === socket.id) {
            connectedUserSockets.delete(userId);
        }

        // Clean all 3 potential slots from waiting & active sets in Redis
        try {
            await slotMatchmakingService.disconnectUser(userId);
        } catch (err) {
            console.error('[MULTI-SLOT DISCONNECT REDIS CLEANUP ERROR]', err.message);
        }

        // Notify and free all active peers on each slot
        if (socket.activeSlots && socket.activeSlots.size > 0) {
            for (const [slotNum, slotData] of socket.activeSlots.entries()) {
                const { roomId, peerId, peerSlot } = slotData;
                if (roomId) {
                    socket.to(roomId).emit('peer-left', {
                        slot: peerSlot,
                        roomId,
                        peerId: userId,
                        message: 'Stranger disconnected'
                    });
                    socket.leave(roomId);

                    // Re-enter matching for the freed peer slot
                    const peerSocketId = connectedUserSockets.get(String(peerId));
                    const peerSocket = peerSocketId ? io.sockets.sockets.get(peerSocketId) : null;
                    if (peerSocket && peerSocket.connected) {
                        peerSocket.activeSlots?.delete(peerSlot);
                        // Trigger immediate rematch notification for the peer's freed slot
                        peerSocket.emit('slot-rematch', { slot: peerSlot });
                        // Put freed slot back into matching
                        if (typeof peerSocket.handleFindMatch === 'function') {
                            peerSocket.handleFindMatch(peerSlot).catch(() => {});
                        }
                    }
                }
            }
            socket.activeSlots.clear();
        }

        console.log(`🔌 Multi-Slot User Disconnected: ${user.name} (${userId})`);
    });
};
