import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../services/socket.service';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ]
};

// Global persistent stream to prevent camera reload flicker on "Next"
let persistentLocalStream = null;

/**
 * Pre-warm Camera & Mic so connection is instant (0ms delay)
 */
export const prewarmMedia = async () => {
    if (persistentLocalStream && persistentLocalStream.active && persistentLocalStream.getVideoTracks().length > 0) {
        return persistentLocalStream;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 360 },
                frameRate: { ideal: 24 }
            },
            audio: true
        });
        persistentLocalStream = stream;
        return stream;
    } catch (err) {
        console.warn('[PREWARM MEDIA ERROR]', err);
        return null;
    }
};

/**
 * Custom WebRTC Hook — 1-on-1 Instant P2P Video Call Engine
 */
export const useWebRTC = (roomId, isCaller, onPeerLeft) => {
    const [localStream, setLocalStream] = useState(persistentLocalStream);
    const [remoteStream, setRemoteStream] = useState(null);
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const [connectionState, setConnectionState] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'

    const peerConnectionRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const pendingOfferRef = useRef(null);

    // Drain queued ICE candidates once remoteDescription is set
    const drainPendingCandidates = async (pc) => {
        if (!pc || !pc.remoteDescription) return;
        while (pendingCandidatesRef.current.length > 0) {
            const cand = pendingCandidatesRef.current.shift();
            try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (err) {
                console.warn('[WEBRTC ICE DRAIN ERROR]', err.message);
            }
        }
    };

    // Close and clean up RTCPeerConnection cleanly (leaves camera alive)
    const closePeerConnection = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.oniceconnectionstatechange = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        pendingCandidatesRef.current = [];
        pendingOfferRef.current = null;
        setRemoteStream(null);
        setConnectionState('connecting');
    }, []);

    useEffect(() => {
        if (!roomId) return;

        const socket = getSocket();
        pendingCandidatesRef.current = [];
        pendingOfferRef.current = null;

        const startWebRTCFlow = async () => {
            try {
                // 1. Reuse persistent local stream if active, or request camera
                let stream = persistentLocalStream;
                if (!stream || !stream.active || stream.getVideoTracks().length === 0) {
                    stream = await prewarmMedia();
                }
                setLocalStream(stream);

                // 2. Create RTCPeerConnection with Google STUN
                const pc = new RTCPeerConnection(ICE_SERVERS);
                peerConnectionRef.current = pc;

                // Monitor ICE Connection State
                pc.oniceconnectionstatechange = () => {
                    console.log(`[WEBRTC ICE STATE] ${pc.iceConnectionState}`);
                    if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
                        setConnectionState('connected');
                    } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                        setConnectionState('disconnected');
                    }
                };

                // Add local stream tracks to Peer Connection
                if (stream) {
                    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
                }

                // Handle incoming remote media track
                pc.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        console.log('🎥 [WEBRTC] Remote stream received');
                        setRemoteStream(event.streams[0]);
                        setConnectionState('connected');
                    }
                };

                // Handle local ICE candidates
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('webrtc:ice', {
                            roomId,
                            candidate: event.candidate
                        });
                    }
                };

                // Check if an offer arrived while camera / pc was initializing
                if (pendingOfferRef.current) {
                    const earlyOffer = pendingOfferRef.current;
                    pendingOfferRef.current = null;
                    console.log(`📥 [WEBRTC] Processing buffered early SDP Offer in room ${roomId}`);
                    await pc.setRemoteDescription(new RTCSessionDescription(earlyOffer));
                    await drainPendingCandidates(pc);

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('webrtc:answer', { roomId, answer });
                } else if (isCaller) {
                    // Caller creates & sends SDP Offer
                    console.log(`📤 [WEBRTC] Caller creating offer for room: ${roomId}`);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc:offer', { roomId, offer });
                }
            } catch (err) {
                console.error('[WEBRTC UserMedia Error]:', err);
            }
        };

        // Handshake Event Listeners (NEVER DROP OFFERS OR CANDIDATES)
        const handleOffer = async ({ offer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) {
                console.log(`📥 [WEBRTC] Buffering incoming offer (PeerConnection not ready yet)`);
                pendingOfferRef.current = offer;
                return;
            }

            try {
                console.log(`📥 [WEBRTC] Handling SDP Offer in room ${roomId}`);
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                await drainPendingCandidates(pc);

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc:answer', { roomId, answer });
            } catch (err) {
                console.error('[WEBRTC Offer Error]:', err);
            }
        };

        const handleAnswer = async ({ answer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            try {
                console.log(`📥 [WEBRTC] Handling SDP Answer in room ${roomId}`);
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
                await drainPendingCandidates(pc);
            } catch (err) {
                console.error('[WEBRTC Answer Error]:', err);
            }
        };

        const handleIceCandidate = async ({ candidate }) => {
            if (!candidate) return;
            const pc = peerConnectionRef.current;
            if (!pc || !pc.remoteDescription) {
                pendingCandidatesRef.current.push(candidate);
                return;
            }

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.warn('[WEBRTC ICE ERROR]', err.message);
            }
        };

        const handlePeerSkipped = () => {
            console.log(`👋 [WEBRTC] Stranger skipped or disconnected`);
            closePeerConnection();
            if (onPeerLeft) onPeerLeft();
        };

        socket.on('webrtc:offer', handleOffer);
        socket.on('webrtc:answer', handleAnswer);
        socket.on('webrtc:ice', handleIceCandidate);
        socket.on('call:peer_skipped', handlePeerSkipped);
        socket.on('call:ended', handlePeerSkipped);

        startWebRTCFlow();

        return () => {
            socket.off('webrtc:offer', handleOffer);
            socket.off('webrtc:answer', handleAnswer);
            socket.off('webrtc:ice', handleIceCandidate);
            socket.off('call:peer_skipped', handlePeerSkipped);
            socket.off('call:ended', handlePeerSkipped);
            closePeerConnection();
        };
    }, [roomId, isCaller, closePeerConnection, onPeerLeft]);

    // Mute / Unmute Audio Track
    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioMuted(!audioTrack.enabled);
            }
        }
    };

    // Video On / Off Track
    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const setIsVideoOff = (val) => setVideoOff(val);

    // Skip to next stranger (notifies peer via socket before tear down)
    const skipCall = () => {
        const socket = getSocket();
        if (roomId) {
            socket.emit('call:skip', { roomId });
        }
        closePeerConnection();
    };

    // End call completely and release hardware
    const stopAllTracks = () => {
        const socket = getSocket();
        if (roomId) {
            socket.emit('call:end', { roomId });
        }
        if (persistentLocalStream) {
            persistentLocalStream.getTracks().forEach((track) => track.stop());
            persistentLocalStream = null;
        }
        closePeerConnection();
    };

    return {
        localStream,
        remoteStream,
        audioMuted,
        videoOff,
        connectionState,
        toggleAudio,
        toggleVideo,
        skipCall,
        stopAllTracks
    };
};
