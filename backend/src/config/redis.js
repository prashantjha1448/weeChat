import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const luaPath = path.join(__dirname, '../scripts/match.lua');
const matchLua = fs.readFileSync(luaPath, 'utf8');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Standalone Redis Client
export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
        return Math.min(times * 150, 2000);
    }
});

// Load atomic Lua script via defineCommand as requested
redis.defineCommand('matchSlot', {
    numberOfKeys: 4,
    lua: matchLua
});

redis.on('connect', () => {
    console.log('✅ Standalone Redis Connected');
});

redis.on('error', (err) => {
    console.error('❌ Redis Error:', err.message);
});

/**
 * On server boot: flush waiting pool and clean all active:* keys
 */
export const initRedis = async () => {
    try {
        // 1. Flush waiting pool
        await redis.del('waiting');

        // 2. Scan and clear all active:* keys
        let cursor = '0';
        let deletedActiveCount = 0;
        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'active:*', 'COUNT', 100);
            cursor = nextCursor;
            if (keys && keys.length > 0) {
                await redis.del(keys);
                deletedActiveCount += keys.length;
            }
        } while (cursor !== '0');

        console.log(`🧹 Flushed Redis "waiting" pool and cleared ${deletedActiveCount} "active:*" keys on server boot`);
    } catch (err) {
        console.error('❌ Failed to clean Redis on server boot:', err.message);
    }
};
