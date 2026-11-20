import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../services/socket.service';
import { getIceServers } from '../services/iceServers.service';
import { useLocalMedia } from './useLocalMedia';
import { createAdaptiveQualityController, applyCodecPreferences } from '../utils/adaptiveQuality';

/**
 * useSlot(slotIndex) Hook
 * Manages RTCPeerConnection and Socket.IO signaling lifecycle for an individual video slot (1..3):
 * - Shares single local MediaStream tracks across slots (no clone)
 * - Queues ICE candidates until remoteDescription is set
 * - Calls setCodecPreferences (H264 / VP8) before offer & answer
 * - Initiates ICE restart only by initiator; non-initiator emits request-restart
 * - Closes old PC and clears stats timer on next/rematch without stopping shared local tracks
 * - Discards signaling messages with stale roomId
 * - StrictMode safe socket listener cleanup on unmount
 * - Remote tile muted by default with per-tile unmute
 */
export const useSlot = (slotIndex) => {
    const slotNum = Number(slotIndex);
    const { localStream } = useLocalMedia();

    const [status, setStatus] = useState('idle'); // idle | searching | connecting | connected | error
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerInfo, setPeerInfo] = useState(null);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [isRemoteMuted, setIsRemoteMuted] = useState(true); // Remote tiles muted by default

    const pcRef = useRef(null);
    const qualityCtrlRef = useRef(null);
    const currentRoomIdRef = useRef(null);
    const isInitiatorRef = useRef(false);
    const iceCandidateQueueRef = useRef([]);
    const isRemoteDescSetRef = useRef(false);

    /**
     * Clean up current PeerConnection and quality stats controller
     * Does NOT stop shared local media tracks
     */
    const cleanupSlotPC = useCallback(() => {
        if (qualityCtrlRef.current) {
            qualityCtrlRef.current.stop();
            qualityCtrlRef.current = null;
        }

        if (pcRef.current) {
            pcRef.current.onicecandidate = null;
            pcRef.current.ontrack = null;
            pcRef.current.oniceconnectionstatechange = null;
            pcRef.current.close();
            pcRef.current = null;
        }

        currentRoomIdRef.current = null;
        isInitiatorRef.current = false;
        iceCandidateQueueRef.current = [];
        isRemoteDescSetRef.current = false;

        setRemoteStream(null);
        setPeerInfo(null);
        setStats(null);
    }, []);

    /**
     * Handle ICE Restart
     * Initiator creates an ICE restart offer; non-initiator emits request-restart to peer
     */
    const triggerIceRestart = useCallback(async () => {
        const pc = pcRef.current;
        const roomId = currentRoomIdRef.current;
        const socket = getSocket();

        if (!pc || !roomId || !socket || !socket.connected) return;

        if (isInitiatorRef.current) {
            try {
                console.log(`[SLOT ${slotNum}] Initiator triggering ICE restart on room ${roomId}`);
                const offer = await pc.createOffer({ iceRestart: true });
                await pc.setLocalDescription(offer);
                socket.emit('offer', {
                    roomId,
                    offer: pc.localDescription,
                    slot: slotNum
                });
            } catch (err) {
                console.error(`[SLOT ${slotNum}] Failed to create ICE restart offer:`, err);
            }
        } else {
            console.log(`[SLOT ${slotNum}] Non-initiator requesting ICE restart from initiator on room ${roomId}`);
            socket.emit('request-restart', { roomId, slot: slotNum });
        }
    }, [slotNum]);

    /**
     * Create RTCPeerConnection and establish tracks/transceivers
     */
    const createSlotPeerConnection = useCallback(async (roomId, isInitiator) => {
        cleanupSlotPC();

        currentRoomIdRef.current = roomId;
        isInitiatorRef.current = isInitiator;
        setStatus('connecting');

        const socket = getSocket();
        const iceConfig = await getIceServers();
        const pc = new RTCPeerConnection(iceConfig);
        pcRef.current = pc;

        // 1. Add shared local tracks (no clone)
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
        }

        // 2. Set codec preferences on video transceiver before offer/answer
        const transceivers = pc.getTransceivers();
        const videoTransceiver = transceivers.find(t => t.receiver?.track?.kind === 'video' || t.sender?.track?.kind === 'video');
        if (videoTransceiver) {
            applyCodecPreferences(videoTransceiver);
        }

        // 3. Handle incoming remote stream tracks
        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
                setStatus('connected');
            }
        };

        // 4. Handle ICE candidates generated locally
        pc.onicecandidate = (event) => {
            if (event.candidate && currentRoomIdRef.current === roomId) {
                socket.emit('ice-candidate', {
                    roomId,
                    candidate: event.candidate,
                    slot: slotNum
                });
            }
        };

        // 5. Handle ICE Connection State Changes & Network Disconnections
        pc.oniceconnectionstatechange = () => {
            const state = pc.iceConnectionState;
            console.log(`[SLOT ${slotNum}] ICE Connection State:`, state);

            if (state === 'connected' || state === 'completed') {
                setStatus('connected');
            } else if (state === 'disconnected' || state === 'failed') {
                console.warn(`[SLOT ${slotNum}] ICE ${state}, attempting ICE restart...`);
                triggerIceRestart();
            }
        };

        // 6. Start adaptive quality controller for this slot
        const qualityController = createAdaptiveQualityController(pc, slotNum, (updatedStats) => {
            setStats(updatedStats);
        });
        qualityCtrlRef.current = qualityController;
        qualityController.start();

        return pc;
    }, [cleanupSlotPC, localStream, slotNum, triggerIceRestart]);

    // Handle incoming offer
    const handleRemoteOffer = useCallback(async (roomId, offer) => {
        const pc = pcRef.current;
        if (!pc || currentRoomIdRef.current !== roomId) return;

        const socket = getSocket();

        try {
            // Apply codec preferences on transceivers before creating answer
            const videoTransceiver = pc.getTransceivers().find(t => t.receiver?.track?.kind === 'video' || t.sender?.track?.kind === 'video');
            if (videoTransceiver) {
                applyCodecPreferences(videoTransceiver);
            }

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            isRemoteDescSetRef.current = true;

            // Drain queued ICE candidates
            while (iceCandidateQueueRef.current.length > 0) {
                const queuedCandidate = iceCandidateQueueRef.current.shift();
                await pc.addIceCandidate(new RTCIceCandidate(queuedCandidate));
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('answer', {
                roomId,
                answer: pc.localDescription,
                slot: slotNum
            });
        } catch (err) {
            console.error(`[SLOT ${slotNum}] Error handling remote offer:`, err);
            setError(err.message);
        }
    }, [slotNum]);

    // Handle incoming answer
    const handleRemoteAnswer = useCallback(async (roomId, answer) => {
        const pc = pcRef.current;
        if (!pc || currentRoomIdRef.current !== roomId) return;

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            isRemoteDescSetRef.current = true;

            // Drain queued ICE candidates
            while (iceCandidateQueueRef.current.length > 0) {
                const queuedCandidate = iceCandidateQueueRef.current.shift();
                await pc.addIceCandidate(new RTCIceCandidate(queuedCandidate));
            }
        } catch (err) {
            console.error(`[SLOT ${slotNum}] Error handling remote answer:`, err);
            setError(err.message);
        }
    }, [slotNum]);

    // Handle incoming ICE candidate
    const handleRemoteIceCandidate = useCallback(async (roomId, candidate) => {
        const pc = pcRef.current;
        if (!pc || currentRoomIdRef.current !== roomId) return;

        try {
            // Queue ICE candidate if remote description is not yet set
            if (!isRemoteDescSetRef.current || !pc.remoteDescription) {
                iceCandidateQueueRef.current.push(candidate);
            } else {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (err) {
            console.warn(`[SLOT ${slotNum}] Failed to add ICE candidate:`, err.message);
        }
    }, [slotNum]);

    // Slot-Specific User Actions
    const findMatch = useCallback(() => {
        cleanupSlotPC();
        setStatus('searching');
        setError(null);
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit('find-match', { slot: slotNum });
        }
    }, [cleanupSlotPC, slotNum]);

    const next = useCallback(() => {
        cleanupSlotPC();
        setStatus('searching');
        setError(null);
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit('next', { slot: slotNum });
        }
    }, [cleanupSlotPC, slotNum]);

    const leaveSlot = useCallback(() => {
        cleanupSlotPC();
        setStatus('idle');
        setError(null);
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit('leave-slot', { slot: slotNum });
        }
    }, [cleanupSlotPC, slotNum]);

    const report = useCallback((reason = 'other') => {
        const peerId = peerInfo?.peerId;
        cleanupSlotPC();
        setStatus('searching');
        setError(null);
        const socket = getSocket();
        if (socket && socket.connected && peerId) {
            socket.emit('report', { slot: slotNum, peerId, reason });
        }
    }, [cleanupSlotPC, peerInfo, slotNum]);

    const toggleRemoteMute = useCallback(() => {
        setIsRemoteMuted(prev => !prev);
    }, []);

    // Setup StrictMode-safe socket listeners for this slot
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        // 1. Matched event on this slot
        const onMatched = async (data) => {
            if (Number(data.slot) !== slotNum) return;

            const { peerId, peerSlot, roomId, initiator } = data;
            setPeerInfo({ peerId, peerSlot, roomId, initiator });

            try {
                const pc = await createSlotPeerConnection(roomId, initiator);

                if (initiator) {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('offer', {
                        roomId,
                        offer: pc.localDescription,
                        slot: slotNum
                    });
                }
            } catch (err) {
                console.error(`[SLOT ${slotNum}] Failed to establish connection after match:`, err);
                setError(err.message);
            }
        };

        // 2. Offer relay
        const onOffer = (data) => {
            if (Number(data.slot) !== slotNum) return;
            if (data.roomId !== currentRoomIdRef.current) return; // Ignore stale room offers
            handleRemoteOffer(data.roomId, data.offer);
        };

        // 3. Answer relay
        const onAnswer = (data) => {
            if (Number(data.slot) !== slotNum) return;
            if (data.roomId !== currentRoomIdRef.current) return; // Ignore stale room answers
            handleRemoteAnswer(data.roomId, data.answer);
        };

        // 4. ICE candidate relay
        const onIceCandidate = (data) => {
            if (Number(data.slot) !== slotNum) return;
            if (data.roomId !== currentRoomIdRef.current) return; // Ignore stale room candidates
            handleRemoteIceCandidate(data.roomId, data.candidate);
        };

        // 5. ICE restart request (received by initiator)
        const onRequestRestart = (data) => {
            if (Number(data.slot) !== slotNum) return;
            if (data.roomId !== currentRoomIdRef.current) return;
            if (isInitiatorRef.current) {
                triggerIceRestart();
            }
        };

        // 6. Peer left slot
        const onPeerLeft = (data) => {
            if (Number(data.slot) !== slotNum) return;
            cleanupSlotPC();
            setStatus('idle');
        };

        // 7. Slot rematch notification (auto re-enters search after peer disconnect)
        const onSlotRematch = (data) => {
            if (Number(data.slot) !== slotNum) return;
            cleanupSlotPC();
            setStatus('searching');
        };

        // 8. Slot waiting pool state
        const onSlotWaiting = (data) => {
            if (Number(data.slot) !== slotNum) return;
            setStatus('searching');
        };

        // 9. Slot error
        const onSlotError = (data) => {
            if (data.slot && Number(data.slot) !== slotNum) return;
            console.warn(`[SLOT ${slotNum} ERROR]:`, data.message);
            setError(data.message);
        };

        // Register handlers
        socket.on('matched', onMatched);
        socket.on('offer', onOffer);
        socket.on('answer', onAnswer);
        socket.on('ice-candidate', onIceCandidate);
        socket.on('request-restart', onRequestRestart);
        socket.on('peer-left', onPeerLeft);
        socket.on('slot-rematch', onSlotRematch);
        socket.on('slot-waiting', onSlotWaiting);
        socket.on('slot-error', onSlotError);

        // Network Online event listener for ICE recovery
        const onOnline = () => {
            if (pcRef.current && currentRoomIdRef.current) {
                console.log(`[SLOT ${slotNum}] Network online detected, triggering ICE restart`);
                triggerIceRestart();
            }
        };
        window.addEventListener('online', onOnline);

        // StrictMode Safe Cleanup on unmount or slot re-registration
        return () => {
            socket.off('matched', onMatched);
            socket.off('offer', onOffer);
            socket.off('answer', onAnswer);
            socket.off('ice-candidate', onIceCandidate);
            socket.off('request-restart', onRequestRestart);
            socket.off('peer-left', onPeerLeft);
            socket.off('slot-rematch', onSlotRematch);
            socket.off('slot-waiting', onSlotWaiting);
            socket.off('slot-error', onSlotError);
            window.removeEventListener('online', onOnline);
            cleanupSlotPC();
        };
    }, [
        slotNum,
        createSlotPeerConnection,
        handleRemoteOffer,
        handleRemoteAnswer,
        handleRemoteIceCandidate,
        triggerIceRestart,
        cleanupSlotPC
    ]);

    return {
        slot: slotNum,
        status,
        remoteStream,
        peerInfo,
        stats,
        error,
        isRemoteMuted,
        toggleRemoteMute,
        findMatch,
        next,
        leaveSlot,
        report
    };
};
