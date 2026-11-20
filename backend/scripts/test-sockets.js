import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import assert from 'assert';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { io: ClientIO } = await import('socket.io-client');
const { default: jwt } = await import('jsonwebtoken');
const { default: mongoose } = await import('mongoose');
const { default: app } = await import('../src/app.js');
const { initSocketServer } = await import('../src/sockets/index.js');
const { redis, initRedis } = await import('../src/config/redis.js');
const { connectDB } = await import('../src/config/db.js');
const { default: UserModel } = await import('../src/models/user.model.js');
const { env } = await import('../src/config/env.js');

/**
 * Socket.IO Multi-Slot Signaling & Matchmaking Extended Verification Suite
 * Verifies all Phase 1 Socket.IO requirements with 3 authenticated test users:
 * 1. Invalid slot (0, 4, "a") rejection
 * 2. 3 users simultaneous find-match -> no double-match, exactly one pair matches
 * 3. matched event emission & single initiator flag
 * 4. WebRTC signaling relay inside roomId; foreign socket & different slot's room socket rejected
 * 5. next{slot} frees slot and rematches only that slot
 * 6. Disconnect cleanup triggers peer-left and slot-rematch for peer's freed slot
 * 7. report{peerId} bidirectional block & 10 consecutive find-match attempts assert they never match
 */

const cleanupRedis = async () => {
    await redis.del('waiting');
    await redis.del('lua:math_seeded');
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

const createTestUser = async (identifier, name) => {
    const email = `${identifier}_multislot_test@test.com`;
    let user = await UserModel.findOne({ email });
    if (!user) {
        user = await UserModel.create({
            name,
            username: `${identifier}_user`,
            email,
            gender: 'other',
            isBanned: false
        });
    }
    return user;
};

const generateToken = (user) => {
    return jwt.sign(
        { _id: String(user._id), email: user.email },
        env.JWT_SECRET,
        {
            algorithm: 'HS256',
            issuer: 'weechat-auth',
            audience: 'weechat-client',
            expiresIn: '2h'
        }
    );
};

const waitForEvent = (socket, event, timeoutMs = 4000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for event "${event}" on socket`));
        }, timeoutMs);

        socket.once(event, (data) => {
            clearTimeout(timer);
            resolve(data);
        });
    });
};

const runSocketTests = async () => {
    let httpServer = null;
    let ioServer = null;
    let socketA = null;
    let socketB = null;
    let socketC = null;
    let passedSuites = 0;

    try {
        console.log('🚀 Initializing Socket.IO Multi-Slot Test Harness...');

        // 1. Connect MongoDB & Redis
        await connectDB();
        await initRedis();
        await cleanupRedis();

        // 2. Create 3 Authenticated Test Users
        const userA = await createTestUser('test_alpha', 'Alpha MultiSlot');
        const userB = await createTestUser('test_beta', 'Beta MultiSlot');
        const userC = await createTestUser('test_gamma', 'Gamma MultiSlot');

        const tokenA = generateToken(userA);
        const tokenB = generateToken(userB);
        const tokenC = generateToken(userC);

        // 3. Start Ephemeral HTTP Server with Socket.IO
        httpServer = http.createServer(app);
        ioServer = initSocketServer(httpServer);

        await new Promise((resolve) => httpServer.listen(0, resolve));
        const port = httpServer.address().port;
        const serverUrl = `http://127.0.0.1:${port}`;
        console.log(`📡 Test Socket Server active on ${serverUrl}\n`);

        // Connect helper
        const connectClient = (token) => {
            return new Promise((resolve, reject) => {
                const s = ClientIO(serverUrl, {
                    auth: { token },
                    transports: ['websocket'],
                    forceNew: true,
                    reconnection: false
                });
                s.on('connect', () => resolve(s));
                s.on('connect_error', (err) => reject(err));
            });
        };

        socketA = await connectClient(tokenA);
        socketB = await connectClient(tokenB);
        socketC = await connectClient(tokenC);

        console.log('✅ Connected 3 Authenticated Sockets: User A, User B, User C\n');

        // =========================================================================
        // SUITE 1: Invalid slot (0, 4, "a") is rejected
        // =========================================================================
        console.log('▶ SUITE 1: Testing invalid slot (0, 4, "a") rejection...');
        const testInvalidSlot = async (slotValue) => {
            const errPromise = waitForEvent(socketA, 'slot-error');
            socketA.emit('find-match', { slot: slotValue });
            const errData = await errPromise;
            assert.ok(errData, 'Must receive slot-error on invalid slot');
            assert.strictEqual(errData.message, 'Invalid slot. Must be 1, 2, or 3.');
        };

        await testInvalidSlot(0);
        await testInvalidSlot(4);
        await testInvalidSlot('a');
        console.log('  ✅ PASSED: Invalid slots (0, 4, "a") correctly rejected with slot-error.\n');
        passedSuites++;

        // =========================================================================
        // SUITE 2: 3 users call find-match simultaneously -> assert NO double-match
        // =========================================================================
        console.log('▶ SUITE 2: Testing 3 users calling find-match simultaneously (No double-match)...');
        await cleanupRedis();

        let matchedEvents = [];
        let waitingEvents = [];

        const onMatchA = (data) => matchedEvents.push({ user: 'A', data });
        const onMatchB = (data) => matchedEvents.push({ user: 'B', data });
        const onMatchC = (data) => matchedEvents.push({ user: 'C', data });

        const onWaitA = (data) => waitingEvents.push({ user: 'A', data });
        const onWaitB = (data) => waitingEvents.push({ user: 'B', data });
        const onWaitC = (data) => waitingEvents.push({ user: 'C', data });

        socketA.on('matched', onMatchA);
        socketB.on('matched', onMatchB);
        socketC.on('matched', onMatchC);

        socketA.on('slot-waiting', onWaitA);
        socketB.on('slot-waiting', onWaitB);
        socketC.on('slot-waiting', onWaitC);

        // 3 users trigger find-match on slot 1 at the exact same moment
        socketA.emit('find-match', { slot: 1 });
        socketB.emit('find-match', { slot: 1 });
        socketC.emit('find-match', { slot: 1 });

        // Wait 800ms for atomic matchmaking resolution
        await new Promise((r) => setTimeout(r, 800));

        socketA.off('matched', onMatchA);
        socketB.off('matched', onMatchB);
        socketC.off('matched', onMatchC);
        socketA.off('slot-waiting', onWaitA);
        socketB.off('slot-waiting', onWaitB);
        socketC.off('slot-waiting', onWaitC);

        // Exactly 2 users must receive 'matched' (1 pair)
        assert.strictEqual(matchedEvents.length, 2, `Exactly 2 endpoints must match (got ${matchedEvents.length})`);

        // Assert no double match: both matched endpoints must share the same roomId
        const [m1, m2] = matchedEvents;
        assert.strictEqual(m1.data.roomId, m2.data.roomId, 'Both matched endpoints must share the exact same roomId');
        assert.notStrictEqual(m1.user, m2.user, 'Matched endpoints must belong to different users');

        // Verify remaining member in waiting pool
        const leftoverWaiting = await redis.smembers('waiting');
        assert.strictEqual(leftoverWaiting.length, 1, `Redis waiting pool must have exactly 1 member (got ${leftoverWaiting.length})`);

        const matchedUserIds = [String(m1.data.peerId), String(m2.data.peerId)];
        const waitingUid = leftoverWaiting[0].split(':')[0];
        assert.ok(!matchedUserIds.includes(waitingUid), 'Unmatched user in waiting must not be one of the matched peers');

        console.log(`  📊 Matched pair: User ${m1.user} <-> User ${m2.user} in ${m1.data.roomId}`);
        console.log(`  📊 Unpaired user sitting in waiting pool: ${leftoverWaiting[0]}`);
        console.log('  ✅ PASSED: 3 simultaneous requests resolved with 0 double-matches.\n');
        passedSuites++;

        // =========================================================================
        // SUITE 3: matched is emitted to both sides, initiator=true on exactly one side
        // =========================================================================
        console.log('▶ SUITE 3: Testing matched event emission & single initiator flag...');
        await cleanupRedis();

        // Socket A starts searching on slot 1 (waiting pool)
        const waitingPromiseA = waitForEvent(socketA, 'slot-waiting');
        socketA.emit('find-match', { slot: 1 });
        const waitingRes = await waitingPromiseA;
        assert.strictEqual(waitingRes.slot, 1);

        // Socket B starts searching on slot 1 -> triggers match with Socket A
        const matchedPromiseA = waitForEvent(socketA, 'matched');
        const matchedPromiseB = waitForEvent(socketB, 'matched');

        socketB.emit('find-match', { slot: 1 });

        const [matchA, matchB] = await Promise.all([matchedPromiseA, matchedPromiseB]);

        assert.strictEqual(matchA.roomId, matchB.roomId, 'Both sockets must receive the exact same roomId');
        assert.strictEqual(matchA.peerId, String(userB._id), "A's peerId must be B");
        assert.strictEqual(matchB.peerId, String(userA._id), "B's peerId must be A");
        assert.strictEqual(matchA.slot, 1);
        assert.strictEqual(matchB.slot, 1);

        // Verify initiator=true on exactly one side
        const initiatorCount = (matchA.initiator ? 1 : 0) + (matchB.initiator ? 1 : 0);
        assert.strictEqual(initiatorCount, 1, `Exactly one side must have initiator=true (got count: ${initiatorCount})`);
        assert.strictEqual(matchB.initiator, true, 'Searching peer (B) who triggered the match must be initiator');
        assert.strictEqual(matchA.initiator, false, 'Waiting pool peer (A) must have initiator=false');

        const sharedRoomId = matchA.roomId;
        console.log(`  ✅ PASSED: Matched in room "${sharedRoomId}". Initiator: B=true, A=false.\n`);
        passedSuites++;

        // =========================================================================
        // SUITE 4: WebRTC relay; foreign socket & socket in different slot's room rejected
        // =========================================================================
        console.log('▶ SUITE 4: Testing WebRTC signaling relay & rejection of foreign/different-slot sockets...');

        // 4a. Foreign socket (User C, not in room) attempts to send offer to sharedRoomId -> rejected
        const cErrorPromise = waitForEvent(socketC, 'slot-error');
        socketC.emit('offer', { roomId: sharedRoomId, offer: { sdp: 'hacker-sdp' }, slot: 1 });
        const cErr = await cErrorPromise;
        assert.ok(cErr.message.includes('Unauthorized'), 'Foreign socket offer must be rejected');

        // Foreign socket attempts answer & ice-candidate -> rejected
        const cAnsErrPromise = waitForEvent(socketC, 'slot-error');
        socketC.emit('answer', { roomId: sharedRoomId, answer: { sdp: 'hacker-ans' }, slot: 1 });
        const cAnsErr = await cAnsErrPromise;
        assert.ok(cAnsErr.message.includes('Unauthorized'));

        const cIceErrPromise = waitForEvent(socketC, 'slot-error');
        socketC.emit('ice-candidate', { roomId: sharedRoomId, candidate: { sdpMid: '0' }, slot: 1 });
        const cIceErr = await cIceErrPromise;
        assert.ok(cIceErr.message.includes('Unauthorized'));

        // 4b. Socket in a DIFFERENT slot's room attempts cross-slot relay:
        // Pair User A and User C on slot 2 in a separate room
        const aSlot2Waiting = waitForEvent(socketA, 'slot-waiting');
        socketA.emit('find-match', { slot: 2 });
        await aSlot2Waiting;

        const aMatchedSlot2Promise = waitForEvent(socketA, 'matched');
        const cMatchedSlot2Promise = waitForEvent(socketC, 'matched');
        socketC.emit('find-match', { slot: 2 });
        const [aMatch2, cMatch2] = await Promise.all([aMatchedSlot2Promise, cMatchedSlot2Promise]);

        const slot2RoomId = aMatch2.roomId;
        assert.notStrictEqual(sharedRoomId, slot2RoomId, 'Slot 1 and Slot 2 must have distinct roomIds');

        // Socket C is in slot 2's room (slot2RoomId). Socket C attempts to send offer to slot 1's room (sharedRoomId)
        const cCrossRoomErrPromise = waitForEvent(socketC, 'slot-error');
        socketC.emit('offer', { roomId: sharedRoomId, offer: { sdp: 'cross-room-offer' }, slot: 1 });
        const cCrossRoomErr = await cCrossRoomErrPromise;
        assert.ok(cCrossRoomErr.message.includes('Unauthorized'), 'Socket in slot 2 room cannot relay to slot 1 room');

        // Socket A is in both rooms, but attempts to send offer with mismatched slot (slot 2 passed for slot 1's room)
        const aMismatchedSlotErrPromise = waitForEvent(socketA, 'slot-error');
        socketA.emit('offer', { roomId: sharedRoomId, offer: { sdp: 'mismatched-slot' }, slot: 2 });
        const aMismatchedErr = await aMismatchedSlotErrPromise;
        assert.ok(aMismatchedErr.message.includes('Unauthorized'), 'Mismatched slot for room must be rejected');

        // 4c. Legitimate relay on slot 1 between User A and User B
        const aOfferPromise = waitForEvent(socketA, 'offer');
        socketB.emit('offer', { roomId: sharedRoomId, offer: { sdp: 'legit-offer-from-b' }, slot: 1 });
        const receivedOffer = await aOfferPromise;
        assert.strictEqual(receivedOffer.offer.sdp, 'legit-offer-from-b');

        const bAnswerPromise = waitForEvent(socketB, 'answer');
        socketA.emit('answer', { roomId: sharedRoomId, answer: { sdp: 'legit-answer-from-a' }, slot: 1 });
        const receivedAnswer = await bAnswerPromise;
        assert.strictEqual(receivedAnswer.answer.sdp, 'legit-answer-from-a');

        const bIcePromise = waitForEvent(socketB, 'ice-candidate');
        socketA.emit('ice-candidate', { roomId: sharedRoomId, candidate: { candidate: 'candidate-a' }, slot: 1 });
        const receivedIce = await bIcePromise;
        assert.strictEqual(receivedIce.candidate.candidate, 'candidate-a');

        // Clean up slot 2
        socketA.emit('leave-slot', { slot: 2 });
        socketC.emit('leave-slot', { slot: 2 });
        await new Promise((r) => setTimeout(r, 200));

        console.log('  ✅ PASSED: Foreign socket and cross-slot offers strictly rejected; legitimate relay succeeds.\n');
        passedSuites++;

        // =========================================================================
        // SUITE 5: next{slot} frees the slot and re-matches only that slot
        // =========================================================================
        console.log('▶ SUITE 5: Testing next{slot} slot freeing & single-slot rematching...');

        // User C enters waiting pool on slot 1
        const cWaitingPromise = waitForEvent(socketC, 'slot-waiting');
        socketC.emit('find-match', { slot: 1 });
        await cWaitingPromise;

        // User A emits next{slot: 1}
        // User B must receive 'peer-left'
        const bPeerLeftPromise = waitForEvent(socketB, 'peer-left');
        // User A and User C must receive 'matched' on slot 1
        const aNextMatchedPromise = waitForEvent(socketA, 'matched');
        const cNextMatchedPromise = waitForEvent(socketC, 'matched');

        socketA.emit('next', { slot: 1 });

        const [bPeerLeft, aNextMatch, cNextMatch] = await Promise.all([
            bPeerLeftPromise,
            aNextMatchedPromise,
            cNextMatchedPromise
        ]);

        assert.strictEqual(bPeerLeft.slot, 1);
        assert.strictEqual(bPeerLeft.peerId, String(userA._id));
        assert.strictEqual(aNextMatch.peerId, String(userC._id), "A's new peer must be C");
        assert.strictEqual(cNextMatch.peerId, String(userA._id), "C's new peer must be A");
        assert.strictEqual(aNextMatch.slot, 1);

        console.log('  ✅ PASSED: next{slot: 1} freed slot from B and successfully rematched with C.\n');
        passedSuites++;

        // =========================================================================
        // SUITE 6: disconnect of one user triggers rematch for the peers' freed slots
        // =========================================================================
        console.log('▶ SUITE 6: Testing disconnect cleanup & peer slot rematch notification...');

        // User A and User C are currently connected on slot 1
        // Disconnecting User C must notify User A with 'peer-left' AND 'slot-rematch'
        const aPeerLeftOnDiscPromise = waitForEvent(socketA, 'peer-left');
        const aRematchPromise = waitForEvent(socketA, 'slot-rematch');

        socketC.disconnect();

        const [peerLeftMsg, rematchMsg] = await Promise.all([aPeerLeftOnDiscPromise, aRematchPromise]);
        assert.strictEqual(peerLeftMsg.slot, 1);
        assert.strictEqual(rematchMsg.slot, 1);

        // Server automatically re-enters User A's freed slot 1 into the pool
        // Now User B calls find-match on slot 1 -> User B matches with User A!
        const aRematchedWithBPromise = waitForEvent(socketA, 'matched');
        const bMatchedWithAPromise = waitForEvent(socketB, 'matched');

        socketB.emit('find-match', { slot: 1 });

        const [aFinalMatch, bFinalMatch] = await Promise.all([aRematchedWithBPromise, bMatchedWithAPromise]);
        assert.strictEqual(aFinalMatch.peerId, String(userB._id));
        assert.strictEqual(bFinalMatch.peerId, String(userA._id));

        console.log('  ✅ PASSED: Disconnect triggered peer-left & slot-rematch; freed slot rematched with B.\n');
        passedSuites++;

        // Reconnect Socket C for remaining tests
        socketC = await connectClient(tokenC);

        // =========================================================================
        // SUITE 7: report{peerId} blocks both ways + 10 CONSECUTIVE find-match attempts NEVER match
        // =========================================================================
        console.log('▶ SUITE 7: Testing report{peerId} & 10 consecutive find-match attempts (Never match)...');

        // User A and User B are currently connected on slot 1
        // User A reports User B
        const bPeerLeftOnReportPromise = waitForEvent(socketB, 'peer-left');
        socketA.emit('report', { slot: 1, peerId: String(userB._id), reason: 'harassment' });
        await bPeerLeftOnReportPromise;

        // Verify bidirectional block in Redis
        const aBlockedB = await redis.sismember(`blocked:${userA._id}`, String(userB._id));
        const bBlockedA = await redis.sismember(`blocked:${userB._id}`, String(userA._id));
        assert.strictEqual(aBlockedB, 1, 'blocked:A must contain B');
        assert.strictEqual(bBlockedA, 1, 'blocked:B must contain A');

        // Verify active sets cleaned
        const aActiveB = await redis.sismember(`active:${userA._id}`, String(userB._id));
        const bActiveA = await redis.sismember(`active:${userB._id}`, String(userA._id));
        assert.strictEqual(aActiveB, 0, 'active:A must not contain B');
        assert.strictEqual(bActiveA, 0, 'active:B must not contain A');

        // Requirement 6a: Run find-match 10 consecutive times between the reported pair and assert they NEVER match
        let unwantedMatches = 0;
        const countUnwantedMatch = () => { unwantedMatches++; };

        socketA.on('matched', countUnwantedMatch);
        socketB.on('matched', countUnwantedMatch);

        console.log('  🔄 Executing 10 consecutive find-match attempts between reported pair...');
        for (let attempt = 1; attempt <= 10; attempt++) {
            socketA.emit('find-match', { slot: 1 });
            socketB.emit('find-match', { slot: 1 });
            await new Promise((r) => setTimeout(r, 120));
        }

        // Allow final propagation window
        await new Promise((r) => setTimeout(r, 600));

        socketA.off('matched', countUnwantedMatch);
        socketB.off('matched', countUnwantedMatch);

        assert.strictEqual(unwantedMatches, 0, `Reported peers matched ${unwantedMatches} times! Must be 0.`);

        // Verify both users remain isolated in waiting set
        const waitingPool = await redis.smembers('waiting');
        assert.ok(waitingPool.includes(`${userA._id}:1`), 'User A must sit in waiting set without pairing');
        assert.ok(waitingPool.includes(`${userB._id}:1`), 'User B must sit in waiting set without pairing');

        console.log('  ✅ PASSED: 10/10 find-match attempts completed with 0 matches. Pair permanently blocked both ways.\n');
        passedSuites++;

        // =========================================================================
        // TEARDOWN & SUMMARY
        // =========================================================================
        console.log('══════════════════════════════════════════════════════════════');
        console.log(`🎉 ALL ${passedSuites} EXTENDED SOCKET TEST SUITES PASSED SUCCESSFULLY!`);
        console.log('══════════════════════════════════════════════════════════════');

        socketA.disconnect();
        socketB.disconnect();
        if (socketC.connected) socketC.disconnect();
        await cleanupRedis();
        await mongoose.connection.close(false);
        ioServer.close();
        httpServer.close();
        process.exit(0);

    } catch (err) {
        console.error('\n❌ EXTENDED SOCKET TEST SUITE FAILED:', err.message);
        console.error(err.stack);
        if (socketA) socketA.disconnect();
        if (socketB) socketB.disconnect();
        if (socketC) socketC.disconnect();
        await cleanupRedis();
        if (mongoose.connection.readyState === 1) await mongoose.connection.close(false);
        if (httpServer) httpServer.close();
        process.exit(1);
    }
};

runSocketTests();
