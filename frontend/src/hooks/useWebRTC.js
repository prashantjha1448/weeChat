import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../services/socket.service';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

/**
 * Custom WebRTC Hook — 1-on-1 P2P Video Call Engine
 */
export const useWebRTC = (roomId, isCaller, onPeerLeft) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        const socket = getSocket();

        const startWebRTCFlow = async () => {
            try {
                // 1. Get User Media (Camera + Microphone)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);
                localStreamRef.current = stream;

                // 2. Create Peer Connection
                const pc = new RTCPeerConnection(ICE_SERVERS);
                peerConnectionRef.current = pc;

                // Add local tracks to Peer Connection
                stream.getTracks().forEach((track) => pc.addTrack(track, stream));

                // Handle incoming Remote Track
                pc.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        setRemoteStream(event.streams[0]);
                    }
                };

                // Handle ICE Candidate Generation
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('webrtc:ice', {
                            roomId,
                            candidate: event.candidate
                        });
                    }
                };

                // If Caller, Create & Send SDP Offer
                if (isCaller) {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc:offer', { roomId, offer });
                }
            } catch (err) {
                console.error("WebRTC UserMedia Error:", err);
            }
        };

        // Socket Event Listeners for WebRTC Handshake
        const handleOffer = async ({ offer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc:answer', { roomId, answer });
        };

        const handleAnswer = async ({ answer }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        };

        const handleIceCandidate = async ({ candidate }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        };

        const handlePeerSkipped = () => {
            cleanupWebRTC();
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
            cleanupWebRTC();
        };
    }, [roomId, isCaller]);

    const cleanupWebRTC = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoOff(!videoTrack.enabled);
            }
        }
    };

    const skipCall = () => {
        const socket = getSocket();
        socket.emit('call:skip', { roomId });
        cleanupWebRTC();
        if (onPeerLeft) onPeerLeft();
    };

    return {
        localStream,
        remoteStream,
        audioMuted,
        videoOff,
        toggleAudio,
        toggleVideo,
        skipCall
    };
};
