/**
 * Matchmaking Service — Ultra-Fast In-Memory Random Matching & Shuffling Engine
 * Pure in-memory (Zero Redis dependency, 100% reliable, <100ms instant pairing)
 */

// In-Memory Waiting Queue Pool Map (Key: socketId string, Value: candidate object)
const waitingQueuePool = new Map();

// Recent Partner Map to prioritize new strangers on Next/Shuffle (Key: socketId/userId -> { partnerId, matchedAt })
const lastPartnerMap = new Map();

export const getMatchQueueSize = () => waitingQueuePool.size;
export const getMatchQueueCandidateIds = () => Array.from(waitingQueuePool.keys());

/**
 * Add Socket/User to Match Queue
 */
export const addToMatchQueue = (user, socketId) => {
    const candidate = {
        socketId,
        userId: user?._id ? user._id.toString() : socketId,
        user,
        joinedAt: Date.now()
    };

    waitingQueuePool.set(socketId, candidate);
    return candidate;
};

/**
 * Remove Socket/User from Match Queue
 */
export const removeFromMatchQueue = (identifier) => {
    if (!identifier) return;
    const str = identifier.toString();

    // Directly delete if key matches socketId
    waitingQueuePool.delete(str);

    // Also prune any entries matching userId
    for (const [k, v] of waitingQueuePool.entries()) {
        if (v.userId === str || v.socketId === str) {
            waitingQueuePool.delete(k);
        }
    }
};

/**
 * Atomically Pair two candidates and emit match:found
 */
export const pairCandidates = (io, candidateA, candidateB) => {
    const sA = candidateA.socketId;
    const sB = candidateB.socketId;

    // Remove both candidates from waiting queue immediately
    waitingQueuePool.delete(sA);
    waitingQueuePool.delete(sB);

    // Record last partner mapping to help shuffle variety (valid 30s)
    lastPartnerMap.set(sA, { partnerId: sB, time: Date.now() });
    lastPartnerMap.set(sB, { partnerId: sA, time: Date.now() });
    if (candidateA.userId) lastPartnerMap.set(candidateA.userId, { partnerId: candidateB.userId, time: Date.now() });
    if (candidateB.userId) lastPartnerMap.set(candidateB.userId, { partnerId: candidateA.userId, time: Date.now() });

    // Validate active socket connections
    const socketA = io.sockets.sockets.get(sA);
    const socketB = io.sockets.sockets.get(sB);

    if (!socketA || !socketA.connected) {
        console.warn(`[MATCHMAKING WARN] Socket A (${sA}) disconnected. Keeping Candidate B in pool.`);
        if (socketB && socketB.connected) {
            waitingQueuePool.set(sB, candidateB);
        }
        return false;
    }

    if (!socketB || !socketB.connected) {
        console.warn(`[MATCHMAKING WARN] Socket B (${sB}) disconnected. Keeping Candidate A in pool.`);
        if (socketA && socketA.connected) {
            waitingQueuePool.set(sA, candidateA);
        }
        return false;
    }

    // Generate unique 1-on-1 WebRTC Call Room ID
    const roomId = `room_${Date.now()}_${sA.slice(-4)}_${sB.slice(-4)}`;

    // Join both sockets to the WebRTC Call Room
    socketA.join(roomId);
    socketB.join(roomId);

    // Emit match:found to Peer A (Caller)
    socketA.emit('match:found', {
        roomId,
        isCaller: true, // Caller initiates WebRTC offer
        peer: {
            userId: candidateB.user?._id || sB,
            name: candidateB.user?.name || 'Stranger',
            username: candidateB.user?.username || 'stranger',
            gender: candidateB.user?.gender || 'other',
            avatar: candidateB.user?.avatar || '',
            city: 'Online'
        }
    });

    // Emit match:found to Peer B (Answerer)
    socketB.emit('match:found', {
        roomId,
        isCaller: false, // Answerer waits for offer
        peer: {
            userId: candidateA.user?._id || sA,
            name: candidateA.user?.name || 'Stranger',
            username: candidateA.user?.username || 'stranger',
            gender: candidateA.user?.gender || 'other',
            avatar: candidateA.user?.avatar || '',
            city: 'Online'
        }
    });

    console.log(`⚡ [INSTANT MATCH] Room: ${roomId} | ${candidateA.user?.name || sA} <-> ${candidateB.user?.name || sB}`);
    return true;
};

/**
 * Instant Match Attempt when a user joins the queue (0ms matching)
 */
export const tryImmediateMatch = (io, currentSocketId) => {
    const currentCandidate = waitingQueuePool.get(currentSocketId);
    if (!currentCandidate) return false;

    // Collect all other eligible waiting candidates
    const available = [];
    for (const [sId, opp] of waitingQueuePool.entries()) {
        if (sId === currentSocketId) continue;
        available.push(opp);
    }

    if (available.length === 0) {
        return false;
    }

    // Prefer candidates with different userId (strangers); fall back to same user if developer testing across devices
    const strangers = available.filter(c => c.userId !== currentCandidate.userId);
    const pool = strangers.length > 0 ? strangers : available;

    // Shuffle & prefer someone who wasn't their immediate previous partner if multiple are online
    const now = Date.now();
    const lastP = lastPartnerMap.get(currentSocketId) || lastPartnerMap.get(currentCandidate.userId);
    let chosen = null;

    if (pool.length > 1 && lastP && (now - lastP.time < 30000)) {
        const fresh = pool.filter(c => c.socketId !== lastP.partnerId && c.userId !== lastP.partnerId);
        if (fresh.length > 0) {
            chosen = fresh[Math.floor(Math.random() * fresh.length)];
        }
    }

    if (!chosen) {
        chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    return pairCandidates(io, currentCandidate, chosen);
};

/**
 * Background Auto-Shuffle Ticker (runs every 500ms)
 * Constantly pairs up any waiting candidates
 */
let tickerStarted = false;
export const startMatchmakingTicker = (io) => {
    if (tickerStarted) return;
    tickerStarted = true;

    setInterval(() => {
        try {
            if (waitingQueuePool.size < 2) return;

            // Prune dead sockets
            for (const [sId, cand] of waitingQueuePool.entries()) {
                const s = io.sockets.sockets.get(cand.socketId);
                if (!s || !s.connected) {
                    waitingQueuePool.delete(sId);
                }
            }

            if (waitingQueuePool.size < 2) return;

            // Collect all waiting candidates
            const candidates = Array.from(waitingQueuePool.values());

            // Fisher-Yates Shuffle for pure random matching
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // Pair them up in pairs of 2
            while (candidates.length >= 2) {
                const candA = candidates.pop();

                // Find candidate with different userId if possible, otherwise different socketId
                let partnerIdx = candidates.findIndex(c => c.userId !== candA.userId);
                if (partnerIdx === -1) {
                    partnerIdx = candidates.findIndex(c => c.socketId !== candA.socketId);
                }

                if (partnerIdx !== -1) {
                    const candB = candidates.splice(partnerIdx, 1)[0];
                    pairCandidates(io, candA, candB);
                } else {
                    // Only same socket left, push back
                    break;
                }
            }
        } catch (err) {
            console.error('[MATCHMAKING TICKER ERROR]', err);
        }
    }, 500);

    console.log('⚡ [MATCHMAKING] Fast auto-shuffle ticker started (500ms interval)');
};
