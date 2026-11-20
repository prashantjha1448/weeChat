import { redis } from '../config/redis.js';

/**
 * Multi-Slot Redis Matchmaking Service
 * Atomic Lua evaluation for 3-slot independent matching pool
 */

const VALID_SLOTS = [1, 2, 3];

export const slotMatchmakingService = {
    /**
     * Atomically find a match or join waiting pool for a given slot
     * @param {string} userId - Current user ID
     * @param {number|string} slot - Slot number (1..3)
     * @returns {Promise<{ peerId: string, peerSlot: number } | null>}
     */
    async findMatch(userId, slot) {
        const slotNum = Number(slot);
        if (!VALID_SLOTS.includes(slotNum)) {
            throw new Error(`Invalid slot "${slot}". Slot must be 1, 2, or 3.`);
        }

        const uid = String(userId);
        const keys = [
            'waiting',
            `seen:${uid}`,
            `active:${uid}`,
            `blocked:${uid}`
        ];

        // Pass high-entropy integer seed for initial Lua math.randomseed call
        const seed = Math.floor((Date.now() % 1000000000) + Math.random() * 1000000);
        const ttl = 86400; // 24 hours TTL for seen history

        // Execute pre-registered Lua command via defineCommand
        const result = await redis.matchSlot(
            keys[0],
            keys[1],
            keys[2],
            keys[3],
            uid,
            String(slotNum),
            ttl,
            seed
        );

        if (!result || !Array.isArray(result) || result.length < 2) {
            return null;
        }

        return {
            peerId: String(result[0]),
            peerSlot: Number(result[1])
        };
    },

    /**
     * Leave a single slot (SREM from waiting, clean active peer link)
     * @param {string} userId
     * @param {number|string} slot
     * @param {string} [peerId]
     */
    async leaveSlot(userId, slot, peerId = null) {
        const uid = String(userId);
        const slotNum = Number(slot);

        await redis.srem('waiting', `${uid}:${slotNum}`);

        if (peerId) {
            const pId = String(peerId);
            await Promise.all([
                redis.srem(`active:${uid}`, pId),
                redis.srem(`active:${pId}`, uid)
            ]);
        }
    },

    /**
     * Refresh 2-hour TTL on active peer set for ongoing activity
     * @param {string} userId
     */
    async refreshActiveTTL(userId) {
        if (!userId) return;
        await redis.expire(`active:${userId}`, 7200);
    },

    /**
     * Clean all slot entries and active sets on disconnect
     * @param {string} userId
     * @returns {Promise<string[]>} List of active peer IDs that were disconnected
     */
    async disconnectUser(userId) {
        const uid = String(userId);

        // Remove all potential slots from waiting pool
        await Promise.all([
            redis.srem('waiting', `${uid}:1`),
            redis.srem('waiting', `${uid}:2`),
            redis.srem('waiting', `${uid}:3`)
        ]);

        // Get currently active peers
        const activePeers = await redis.smembers(`active:${uid}`);

        // Remove uid from active sets of connected peers
        if (activePeers && activePeers.length > 0) {
            const cleanupPromises = activePeers.map(peerId => redis.srem(`active:${peerId}`, uid));
            await Promise.all(cleanupPromises);
        }

        // Delete user's active set
        await redis.del(`active:${uid}`);

        return activePeers || [];
    },

    /**
     * Report a peer (add to persistent blocked set and clean active link)
     * @param {string} reporterId
     * @param {string} peerId
     */
    async reportPeer(reporterId, peerId) {
        const rId = String(reporterId);
        const pId = String(peerId);

        // Block both directions so neither user can ever match again
        await Promise.all([
            redis.sadd(`blocked:${rId}`, pId),
            redis.sadd(`blocked:${pId}`, rId),
            redis.srem(`active:${rId}`, pId),
            redis.srem(`active:${pId}`, rId)
        ]);
    },

    /**
     * Reset waiting pool
     */
    async flushWaiting() {
        await redis.del('waiting');
    }
};
