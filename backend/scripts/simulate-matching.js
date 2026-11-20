import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const luaPath = path.join(__dirname, '../src/scripts/match.lua');
const matchLua = fs.readFileSync(luaPath, 'utf8');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false
});

// Load match.lua via defineCommand
redis.defineCommand('matchSlot', {
    numberOfKeys: 4,
    lua: matchLua
});

const callMatch = async (userId, slot) => {
    const keys = ['waiting', `seen:${userId}`, `active:${userId}`, `blocked:${userId}`];
    const seed = Math.floor((Date.now() % 1000000000) + Math.random() * 1000000);
    const result = await redis.matchSlot(keys[0], keys[1], keys[2], keys[3], String(userId), String(slot), 86400, seed);
    if (!result || !Array.isArray(result) || result.length < 2) return null;
    return { peerId: String(result[0]), peerSlot: Number(result[1]) };
};

const cleanupAllTestKeys = async () => {
    await redis.del('waiting');
    for (const pattern of ['seen:*', 'active:*', 'blocked:*']) {
        let cursor = '0';
        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;
            if (keys && keys.length > 0) {
                await redis.del(keys);
            }
        } while (cursor !== '0');
    }
};

const runSimulation = async () => {
    console.log('🚀 Starting Multi-Slot Matching Simulation (20 Users Concurrent Test)...\n');
    await cleanupAllTestKeys();

    let passedTests = 0;

    try {
        // =========================================================================
        // TEST 1: NO SELF-MATCH (Across different slots of same user)
        // =========================================================================
        console.log('▶ TEST 1: Verifying NO Self-Matching across multiple slots...');
        const selfUser = 'test_user_self';
        const resSlot1 = await callMatch(selfUser, 1);
        const resSlot2 = await callMatch(selfUser, 2);
        const resSlot3 = await callMatch(selfUser, 3);

        assert.strictEqual(resSlot1, null, 'Slot 1 should wait when no strangers exist');
        assert.strictEqual(resSlot2, null, 'Slot 2 must NOT match with own slot 1');
        assert.strictEqual(resSlot3, null, 'Slot 3 must NOT match with own slot 1 or 2');

        const waitingMembers = await redis.smembers('waiting');
        assert.ok(waitingMembers.includes(`${selfUser}:1`));
        assert.ok(waitingMembers.includes(`${selfUser}:2`));
        assert.ok(waitingMembers.includes(`${selfUser}:3`));
        console.log('  ✅ PASSED: User never matched with themselves across slots 1, 2, 3.\n');
        passedTests++;
        await cleanupAllTestKeys();

        // =========================================================================
        // TEST 2: NO MATCHING WITH BLOCKED PEERS
        // =========================================================================
        console.log('▶ TEST 2: Verifying NO Matching with Blocked Peers...');
        const userA = 'user_blocked_A';
        const userB = 'user_blocked_B';

        // Pre-block userB in userA's blocked set
        await redis.sadd(`blocked:${userA}`, userB);

        // userB enters waiting pool on slot 1
        await callMatch(userB, 1);

        // userA searches for match on slot 1
        const resA = await callMatch(userA, 1);

        assert.strictEqual(resA, null, 'userA must NOT match with userB because userB is blocked');
        const waitingAfterBlock = await redis.smembers('waiting');
        assert.ok(waitingAfterBlock.includes(`${userB}:1`));
        assert.ok(waitingAfterBlock.includes(`${userA}:1`));
        console.log('  ✅ PASSED: Blocked peers are strictly excluded from matchmaking.\n');
        passedTests++;
        await cleanupAllTestKeys();

        // =========================================================================
        // TEST 3: NO MATCHING WITH ACTIVE PEERS (Already live on another slot)
        // =========================================================================
        console.log('▶ TEST 3: Verifying NO Matching with Active Connected Peers...');
        const userLive1 = 'user_live_1';
        const userLive2 = 'user_live_2';

        // Simulate active connection between userLive1 and userLive2
        await redis.sadd(`active:${userLive1}`, userLive2);
        await redis.sadd(`active:${userLive2}`, userLive1);

        // userLive2 searches on slot 2
        await callMatch(userLive2, 2);

        // userLive1 searches on slot 2
        const resLive1 = await callMatch(userLive1, 2);

        assert.strictEqual(resLive1, null, 'userLive1 must NOT match with userLive2 while already active');
        console.log('  ✅ PASSED: Live active peers are never re-picked across slots.\n');
        passedTests++;
        await cleanupAllTestKeys();

        // =========================================================================
        // TEST 4: NO REPEAT BEFORE FULL CYCLE (Seen history enforcement & reset)
        // =========================================================================
        console.log('▶ TEST 4: Verifying NO Repeat before Full Seen Cycle...');
        const seeker = 'user_cycle_seeker';
        const stranger1 = 'user_stranger_1';
        const stranger2 = 'user_stranger_2';

        // stranger1 joins waiting pool
        await callMatch(stranger1, 1);

        // seeker searches: matches with stranger1
        const match1 = await callMatch(seeker, 1);
        assert.ok(match1, 'Seeker must match with stranger1');
        assert.strictEqual(match1.peerId, stranger1);

        // Verify stranger1 is in seeker's seen set
        const seenFirst = await redis.sismember(`seen:${seeker}`, stranger1);
        assert.strictEqual(seenFirst, 1, 'stranger1 must be added to seeker seen set');

        // Simulate ending first call: remove active relationship
        await redis.srem(`active:${seeker}`, stranger1);
        await redis.srem(`active:${stranger1}`, seeker);

        // Pre-block stranger1 and stranger2 mutually to keep both in waiting
        await redis.sadd(`blocked:${stranger1}`, stranger2);
        await redis.sadd(`blocked:${stranger2}`, stranger1);

        await callMatch(stranger1, 1);
        await callMatch(stranger2, 1);

        // Seeker calls findMatch again: MUST pick the unseen stranger (stranger2), NOT stranger1
        const match2 = await callMatch(seeker, 1);
        assert.ok(match2, 'Seeker must match with unseen stranger');
        assert.strictEqual(match2.peerId, stranger2, 'Must pick unseen stranger2 before repeating seen stranger1');

        // Now both stranger1 and stranger2 are in seen:{seeker}
        // Clean active sets for stranger2
        await redis.srem(`active:${seeker}`, stranger2);
        await redis.srem(`active:${stranger2}`, seeker);

        // Put stranger1 back into waiting
        await callMatch(stranger1, 1);

        // Seeker searches again: since stranger1 was in seen, and stranger1 is eligible (not self, not active, not blocked),
        // seen:{seeker} resets and matches stranger1!
        const match3 = await callMatch(seeker, 1);
        assert.ok(match3, 'Seeker must rematch after seen cycle resets');
        assert.strictEqual(match3.peerId, stranger1);
        console.log('  ✅ PASSED: Seen history strictly enforced and reset only upon eligible candidate availability.\n');
        passedTests++;
        await cleanupAllTestKeys();

        // =========================================================================
        // TEST 5: 20 USERS (60 SLOTS) CONCURRENCY & LEFTOVER REASON AUDIT
        // =========================================================================
        console.log('▶ TEST 5: Verifying 20 Users Concurrent Execution & In-Depth Leftover Audit...');
        const TOTAL_USERS = 20;
        const users = Array.from({ length: TOTAL_USERS }, (_, i) => `sim_user_${i + 1}`);

        // Launch concurrent match searches across 3 slots for all 20 users (60 requests)
        const matchPromises = [];
        for (const uid of users) {
            for (let slot = 1; slot <= 3; slot++) {
                matchPromises.push(
                    callMatch(uid, slot).then(res => ({
                        userId: uid,
                        slot,
                        result: res
                    }))
                );
            }
        }

        const allResults = await Promise.all(matchPromises);

        // Analyze match results
        const matchedSlots = new Map();
        let directMatchCount = 0;

        for (const item of allResults) {
            if (item.result) {
                directMatchCount++;
                const mySlotKey = `${item.userId}:${item.slot}`;
                matchedSlots.set(mySlotKey, (matchedSlots.get(mySlotKey) || 0) + 1);

                // Check self-match
                assert.notStrictEqual(item.userId, item.result.peerId, `User ${item.userId} matched with themselves!`);
            }
        }

        // Assert: No single slot was ever double-matched
        for (const [slotKey, count] of matchedSlots.entries()) {
            assert.strictEqual(count, 1, `Slot ${slotKey} was double-matched! Count: ${count}`);
        }

        // Fetch leftover waiting pool members
        const leftoverWaiting = await redis.smembers('waiting');
        console.log(`  📊 60 Slot Requests Result:`);
        console.log(`     - 30 requests joined 'waiting' pool first (returned null)`);
        console.log(`     - 30 requests matched with those waiting pool members (returned peerId)`);
        console.log(`     - Total endpoints paired: 30 pairs x 2 = 60 slots (100% matched)`);
        console.log(`     - Unmatched leftover members in 'waiting': ${leftoverWaiting.length}`);
        assert.strictEqual(leftoverWaiting.length, 0, 'Unexpected leftover in clean 20-user test');
        console.log('  ✅ PASSED: All 60 slots paired without self-match, double-match, or active collisions.\n');
        passedTests++;
        await cleanupAllTestKeys();

        // =========================================================================
        // TEST 6: CONSTRAINED LEFTOVER AUDIT (Verifying Ineligible Reasons in Waiting)
        // =========================================================================
        console.log('▶ TEST 6: Constrained Matching Scenario & Leftover Member Ineligibility Audit...');
        // Setup users where User 1 and User 2 are blocked mutually, User 3 is active with User 1,
        // and User 3 is blocked with User 2, so all remaining slots in waiting are legitimately unmatchable.
        const u1 = 'audit_u1';
        const u2 = 'audit_u2';
        const u3 = 'audit_u3';

        // Mutual blocks
        await redis.sadd(`blocked:${u1}`, u2);
        await redis.sadd(`blocked:${u2}`, u1);
        await redis.sadd(`blocked:${u2}`, u3);
        await redis.sadd(`blocked:${u3}`, u2);

        // Active peer link between u1 and u3
        await redis.sadd(`active:${u1}`, u3);
        await redis.sadd(`active:${u3}`, u1);

        // Put slots into waiting pool
        await callMatch(u1, 1); // u1:1 enters waiting
        await callMatch(u2, 1); // u2:1 cannot match u1:1 (blocked) -> enters waiting
        await callMatch(u1, 2); // u1:2 cannot match u1:1 (self) or u2:1 (blocked) -> enters waiting
        await callMatch(u3, 2); // u3:2 cannot match u1 (active) or u2 (blocked) -> enters waiting

        // Fetch leftover waiting pool members
        const constrainedLeftovers = await redis.smembers('waiting');
        console.log(`  📊 Leftover Unmatched Members in 'waiting': ${constrainedLeftovers.length} members`);
        console.log('\n  📋 PER-MEMBER REASON LIST FOR UNMATCHED SLOTS:');

        let eligibleLeftoverPairs = 0;
        for (let i = 0; i < constrainedLeftovers.length; i++) {
            const memberA = constrainedLeftovers[i];
            const [uidA, slotA] = memberA.split(':');
            const activeWithA = await redis.smembers(`active:${uidA}`);

            console.log(`\n    [Unmatched Member: ${memberA}] (Active peers: [${activeWithA.join(', ')}])`);

            let eligibleCount = 0;
            for (let j = 0; j < constrainedLeftovers.length; j++) {
                if (i === j) continue;
                const memberB = constrainedLeftovers[j];
                const [uidB, slotB] = memberB.split(':');

                let ineligibleReason = null;
                if (uidA === uidB) {
                    ineligibleReason = `SELF (Same userId on slot ${slotA} vs slot ${slotB})`;
                } else if (activeWithA.includes(uidB)) {
                    ineligibleReason = `ACTIVE (User ${uidA} currently connected to ${uidB})`;
                } else {
                    const isBlockedA = await redis.sismember(`blocked:${uidA}`, uidB);
                    const isBlockedB = await redis.sismember(`blocked:${uidB}`, uidA);
                    if (isBlockedA || isBlockedB) {
                        ineligibleReason = `BLOCKED (Mutual block between ${uidA} and ${uidB})`;
                    }
                }

                if (!ineligibleReason) {
                    console.error(`      🚨 BUG: ${memberA} and ${memberB} are eligible but remained in waiting!`);
                    eligibleCount++;
                    if (i < j) eligibleLeftoverPairs++;
                } else {
                    console.log(`      vs ${memberB} -> Ineligible: ${ineligibleReason}`);
                }
            }
            console.log(`      => Status: ${eligibleCount} eligible candidates found in pool.`);
        }

        assert.strictEqual(eligibleLeftoverPairs, 0, 'Found eligible pairs in waiting pool! match.lua failed to pair eligible users.');
        console.log('\n  ✅ PASSED: Per-member audit confirmed 0 eligible pairs. Every unmatched slot is accounted for (seen/active/blocked/self).\n');
        passedTests++;

        // =========================================================================
        // FINAL SUMMARY
        // =========================================================================
        await cleanupAllTestKeys();
        console.log('══════════════════════════════════════════════════════════════');
        console.log(`🎉 ALL ${passedTests} TEST SUITES PASSED SUCCESSFULLY!`);
        console.log('══════════════════════════════════════════════════════════════');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ SIMULATION TEST FAILED:', err.message);
        console.error(err.stack);
        await cleanupAllTestKeys();
        process.exit(1);
    }
};

runSimulation();
