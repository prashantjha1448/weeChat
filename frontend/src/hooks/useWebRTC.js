import { useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        if (!roomId) return;

        const socket = getSocket();
        pendingCandidatesRef.current = [];

        const startWebRTCFlow = async () => {
            try {
                // 1. Reuse persistent local stream if active, or request camera
                let stream = persistentLocalStream;
                if (!stream || !stream.active || stream.getVideoTracks().length === 0) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 640 },
                            height: { ideal: 360 },
                            frameRate: { ideal: 24 }
                        },
                        audio: true
                    });
                    persistentLocalStream = stream;
                }
                setLocalStream(stream);

                // 2. Create RTCPeerConnection with STUN
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
                stream.getTracks().forEach((track) => pc.addTrack(track, stream));

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

                // Caller creates & sends SDP Offer
                if (isCaller) {
                    console.log(`📤 [WEBRTC] Caller creating offer for room: ${roomId}`);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc:offer', { roomId, offer });
                }
            } catch (err) {
                console.error('[WEBRTC UserMedia Error]:', err);
            }
        };

        // Handshake Event Listeners
        const handleOffer = async ({ offer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            console.log(`📥 [WEBRTC] Handling SDP Offer in room ${roomId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            await drainPendingCandidates(pc);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc:answer', { roomId, answer });
        };

        const handleAnswer = async ({ answer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            console.log(`📥 [WEBRTC] Handling SDP Answer in room ${roomId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            await drainPendingCandidates(pc);
        };

        const handleIceCandidate = async ({ candidate }) => {
            const pc = peerConnectionRef.current;
            if (!pc || !candidate) return;

            if (!pc.remoteDescription) {
                pendingCandidatesRef.current.push(candidate);
            } else {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.warn('[WEBRTC ICE ERROR]', err.message);
                }
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
    }, [roomId, isCaller]);

    // Close PeerConnection without stopping local hardware camera tracks
    const closePeerConnection = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        setConnectionState('connecting');
        pendingCandidatesRef.current = [];
    };

    // Full shutdown (called when user completely leaves video chat)
    const stopAllTracks = () => {
        closePeerConnection();
        if (persistentLocalStream) {
            persistentLocalStream.getTracks().forEach((track) => track.stop());
            persistentLocalStream = null;
            setLocalStream(null);
        }
    };

    const toggleAudio = () => {
        if (persistentLocalStream) {
            const audioTrack = persistentLocalStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (persistentLocalStream) {
            const videoTrack = persistentLocalStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoOff(!videoTrack.enabled);
            }
        }
    };

    // Skip current call & immediately search for next stranger
    const skipCall = () => {
        const socket = getSocket();
        socket.emit('call:skip', { roomId });
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
