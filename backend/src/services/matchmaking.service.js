/**
 * Matchmaking Service — High-Speed In-Memory Random Matching & Shuffling Engine
 * Pure in-memory (Zero Redis dependency, 100% reliable across all hosting providers)
 */

// In-Memory Waiting Queue Pool Map (Key: userId string, Value: candidate object)
const waitingQueuePool = new Map();

// Recent Partner Map to prioritize new strangers on Next/Shuffle (Key: userId string -> { partnerId, matchedAt })
const lastPartnerMap = new Map();

export const getMatchQueueSize = () => waitingQueuePool.size;
export const getMatchQueueCandidateIds = () => Array.from(waitingQueuePool.keys());

/**
 * Add User to Match Queue
 */
export const addToMatchQueue = (user, socketId) => {
    const userIdStr = user._id.toString();

    const candidate = {
        userId: userIdStr,
        user,
        socketId,
        joinedAt: Date.now()
    };

    waitingQueuePool.set(userIdStr, candidate);
    return candidate;
};

/**
 * Remove User from Match Queue
 */
export const removeFromMatchQueue = (userId) => {
    if (!userId) return;
    const userIdStr = userId.toString();
    waitingQueuePool.delete(userIdStr);
};

/**
 * Atomically Pair two candidates and emit match:found
 */
export const pairCandidates = (io, candidateA, candidateB) => {
    const idA = candidateA.userId;
    const idB = candidateB.userId;

    // Remove both candidates from waiting queue
    waitingQueuePool.delete(idA);
    waitingQueuePool.delete(idB);

    // Record last partner mapping to help shuffle variety (valid 30s)
    lastPartnerMap.set(idA, { partnerId: idB, time: Date.now() });
    lastPartnerMap.set(idB, { partnerId: idA, time: Date.now() });

    // Validate active socket connections
    const socketA = io.sockets.sockets.get(candidateA.socketId);
    const socketB = io.sockets.sockets.get(candidateB.socketId);

    if (!socketA || !socketA.connected) {
        console.warn(`[MATCHMAKING WARN] Socket A (${candidateA.socketId}) disconnected. Keeping Candidate B in pool.`);
        if (socketB && socketB.connected) {
            waitingQueuePool.set(idB, candidateB);
        }
        return false;
    }

    if (!socketB || !socketB.connected) {
        console.warn(`[MATCHMAKING WARN] Socket B (${candidateB.socketId}) disconnected. Keeping Candidate A in pool.`);
        if (socketA && socketA.connected) {
            waitingQueuePool.set(idA, candidateA);
        }
        return false;
    }

    // Generate unique 1-on-1 WebRTC Call Room ID
    const roomId = `room_${Date.now()}_${idA.slice(-4)}_${idB.slice(-4)}`;

    // Join both sockets to the WebRTC Call Room
    socketA.join(roomId);
    socketB.join(roomId);

    const matchScore = 85 + Math.floor(Math.random() * 14); // 85% - 98% compatibility

    // Emit match:found to Peer A (Caller)
    socketA.emit('match:found', {
        roomId,
        matchScore,
        isCaller: true, // Caller initiates WebRTC offer
        peer: {
            userId: candidateB.user._id,
            name: candidateB.user.name || 'Stranger',
            username: candidateB.user.username || 'stranger',
            gender: candidateB.user.gender || 'other',
            avatar: candidateB.user.avatar || '',
            city: 'Online'
        }
    });

    // Emit match:found to Peer B (Answerer)
    socketB.emit('match:found', {
        roomId,
        matchScore,
        isCaller: false, // Answerer waits for offer
        peer: {
            userId: candidateA.user._id,
            name: candidateA.user.name || 'Stranger',
            username: candidateA.user.username || 'stranger',
            gender: candidateA.user.gender || 'other',
            avatar: candidateA.user.avatar || '',
            city: 'Online'
        }
    });

    console.log(`🎉 [INSTANT MATCH] Room: ${roomId} | ${candidateA.user.name} <-> ${candidateB.user.name}`);
    return true;
};

/**
 * Instant Match Attempt when a user joins the queue
 */
export const tryImmediateMatch = (io, currentUserId) => {
    const currentCandidate = waitingQueuePool.get(currentUserId.toString());
    if (!currentCandidate) return false;

    // Collect all other eligible candidates
    const available = [];
    for (const [id, opp] of waitingQueuePool.entries()) {
        if (id === currentUserId.toString()) continue;
        available.push(opp);
    }

    if (available.length === 0) {
        return false;
    }

    // Shuffle & prefer someone who wasn't their immediate previous partner if multiple are online
    const now = Date.now();
    const lastP = lastPartnerMap.get(currentUserId.toString());
    let chosen = null;

    if (available.length > 1 && lastP && (now - lastP.time < 30000)) {
        const fresh = available.filter(c => c.userId !== lastP.partnerId);
        if (fresh.length > 0) {
            chosen = fresh[Math.floor(Math.random() * fresh.length)];
        }
    }

    if (!chosen) {
        chosen = available[Math.floor(Math.random() * available.length)];
    }

    return pairCandidates(io, currentCandidate, chosen);
};

/**
 * Background Auto-Shuffle Ticker (runs every 1 second)
 * Whenever 2 or more users are online & waiting, it pairs them up immediately!
 */
let tickerStarted = false;
export const startMatchmakingTicker = (io) => {
    if (tickerStarted) return;
    tickerStarted = true;

    setInterval(() => {
        try {
            if (waitingQueuePool.size < 2) return;

            // Prune dead sockets
            for (const [id, cand] of waitingQueuePool.entries()) {
                const s = io.sockets.sockets.get(cand.socketId);
                if (!s || !s.connected) {
                    waitingQueuePool.delete(id);
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
                const candB = candidates.pop();

                if (candA.userId === candB.userId) {
                    if (candidates.length > 0) {
                        const candC = candidates.pop();
                        pairCandidates(io, candA, candC);
                        candidates.push(candB);
                    }
                } else {
                    pairCandidates(io, candA, candB);
                }
            }
        } catch (err) {
            console.error('[MATCHMAKING TICKER ERROR]', err);
        }
    }, 1000);

    console.log('⚡ [MATCHMAKING] Auto-shuffle ticker started (1s interval)');
};
