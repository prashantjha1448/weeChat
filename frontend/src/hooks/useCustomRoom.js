import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const getSocketUrl = () => {
    if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return 'https://weechat-api.onrender.com';
    }
    return 'http://localhost:3002';
};

const SOCKET_SERVER_URL = getSocketUrl();
const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
];


export const useCustomRoom = (roomId, currentUser) => {
    const socketRef = useRef(null);
    const localStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const peerConnections = useRef(new Map());

    const [participants, setParticipants] = useState([]);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    const [messages, setMessages] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [activeScreenShareSocketId, setActiveScreenShareSocketId] = useState(null);
    const [hostId, setHostId] = useState(null);
    const [roomEnded, setRoomEnded] = useState(false);

    // Initialize Local Audio/Video Stream
    useEffect(() => {
        let isMounted = true;
        const initLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    localStreamRef.current = stream;
                }
            } catch (err) {
                console.warn('[MEDIA ACCESS WARN]', err.message);
                try {
                    const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    if (isMounted) {
                        localStreamRef.current = audioOnly;
                        setIsCameraOff(true);
                    }
                } catch (e) {
                    console.error('[NO MEDIA ACCESS]', e);
                }
            }
        };

        initLocalStream();

        return () => {
            isMounted = false;
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Create RTCPeerConnection for a targeted remote peer
    const createPeerConnection = useCallback((targetSocketId) => {
        if (peerConnections.current.has(targetSocketId)) {
            return peerConnections.current.get(targetSocketId);
        }

        const pc = new RTCPeerConnection({ iceServers });

        // Add local tracks to PC
        const activeStream = screenStreamRef.current || localStreamRef.current;
        if (activeStream) {
            activeStream.getTracks().forEach(track => {
                pc.addTrack(track, activeStream);
            });
        }

        // ICE candidate handler
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('webrtc:room-ice', {
                    targetSocketId,
                    candidate: event.candidate
                });
            }
        };

        // Track handler for receiving remote audio/video
        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStreams(prev => {
                    const next = new Map(prev);
                    next.set(targetSocketId, event.streams[0]);
                    return next;
                });
            }
        };

        peerConnections.current.set(targetSocketId, pc);
        return pc;
    }, []);

    // Initialize Socket Connection & WebRTC Listeners
    useEffect(() => {
        if (!roomId) return;

        const socket = io(SOCKET_SERVER_URL, {
            withCredentials: true,
            transports: ['websocket']
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('room:join', { roomId });
        });

        // 1. Participant Roster Updated
        socket.on('room:participants-updated', ({ participants: updatedParticipants, hostId: newHostId }) => {
            setParticipants(updatedParticipants);
            if (newHostId) setHostId(newHostId);
        });

        // 2. New Peer Joined Room — Create WebRTC Offer to new peer
        socket.on('room:user-joined', async ({ socketId: targetSocketId, name }) => {
            toast.info(`${name} joined the room`);
            const pc = createPeerConnection(targetSocketId);
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('webrtc:room-offer', { targetSocketId, offer });
            } catch (err) {
                console.error('[CREATE OFFER ERROR]', err);
            }
        });

        // 3. Received WebRTC Offer from Peer
        socket.on('webrtc:room-offer', async ({ senderSocketId, offer }) => {
            const pc = createPeerConnection(senderSocketId);
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc:room-answer', { targetSocketId: senderSocketId, answer });
            } catch (err) {
                console.error('[HANDLE OFFER ERROR]', err);
            }
        });

        // 4. Received WebRTC Answer
        socket.on('webrtc:room-answer', async ({ senderSocketId, answer }) => {
            const pc = peerConnections.current.get(senderSocketId);
            if (pc) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                    console.error('[HANDLE ANSWER ERROR]', err);
                }
            }
        });

        // 5. Received WebRTC ICE Candidate
        socket.on('webrtc:room-ice', async ({ senderSocketId, candidate }) => {
            const pc = peerConnections.current.get(senderSocketId);
            if (pc && candidate) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('[ADD ICE ERROR]', err);
                }
            }
        });

        // 6. User Left Room
        socket.on('room:user-left', ({ socketId: leftSocketId, name }) => {
            if (name) toast.info(`${name} left the room`);
            if (peerConnections.current.has(leftSocketId)) {
                peerConnections.current.get(leftSocketId).close();
                peerConnections.current.delete(leftSocketId);
            }
            setRemoteStreams(prev => {
                const next = new Map(prev);
                next.delete(leftSocketId);
                return next;
            });
        });

        // 7. Media State Sync
        socket.on('room:media-state-changed', ({ socketId: peerSockId, isSharingScreen: sharing }) => {
            if (sharing) {
                setActiveScreenShareSocketId(peerSockId);
            } else if (activeScreenShareSocketId === peerSockId) {
                setActiveScreenShareSocketId(null);
            }
        });

        // 8. New Chat Message Received
        socket.on('room:new-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // 9. Host Kick / End Notifications
        socket.on('room:kicked', ({ message }) => {
            toast.error(message || 'You were removed from the room');
            setRoomEnded(true);
        });

        socket.on('room:ended', ({ message }) => {
            toast.error(message || 'Room ended by host');
            setRoomEnded(true);
        });

        return () => {
            socket.emit('room:leave', { roomId });
            socket.disconnect();
            peerConnections.current.forEach(pc => pc.close());
            peerConnections.current.clear();
        };
    }, [roomId, createPeerConnection, activeScreenShareSocketId]);

    // Toggle Microphone Mute/Unmute
    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                const newMuted = !audioTrack.enabled;
                setIsMuted(newMuted);
                socketRef.current?.emit('room:media-state-toggle', {
                    roomId,
                    isMuted: newMuted,
                    isCameraOff,
                    isSharingScreen
                });
            }
        }
    };

    // Toggle Camera On/Off
    const toggleCamera = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                const newCamOff = !videoTrack.enabled;
                setIsCameraOff(newCamOff);
                socketRef.current?.emit('room:media-state-toggle', {
                    roomId,
                    isMuted,
                    isCameraOff: newCamOff,
                    isSharingScreen
                });
            }
        }
    };

    // Toggle Screen Sharing
    const toggleScreenShare = async () => {
        if (isSharingScreen) {
            // Stop Screen Share
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(t => t.stop());
                screenStreamRef.current = null;
            }
            setIsSharingScreen(false);

            // Revert PeerConnections to local camera video track
            const videoTrack = localStreamRef.current?.getVideoTracks()[0];
            if (videoTrack) {
                peerConnections.current.forEach(pc => {
                    const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
                    if (sender) sender.replaceTrack(videoTrack);
                });
            }

            socketRef.current?.emit('room:media-state-toggle', {
                roomId,
                isMuted,
                isCameraOff,
                isSharingScreen: false
            });
        } else {
            // Start Screen Share
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                screenStreamRef.current = screenStream;
                const screenTrack = screenStream.getVideoTracks()[0];

                setIsSharingScreen(true);
                socketRef.current?.emit('room:media-state-toggle', {
                    roomId,
                    isMuted,
                    isCameraOff,
                    isSharingScreen: true
                });

                // Replace video track across all PCs with screen track
                peerConnections.current.forEach(pc => {
                    const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
                    if (sender) sender.replaceTrack(screenTrack);
                });

                // Auto stop when user stops sharing via browser UI
                screenTrack.onended = () => {
                    toggleScreenShare();
                };
            } catch (err) {
                console.error('[SCREEN SHARE CANCELLED/ERROR]', err);
            }
        }
    };

    // Send Group Chat Message
    const sendMessage = (text) => {
        if (!text || !text.trim() || !socketRef.current) return;
        socketRef.current.emit('room:send-message', { roomId, message: text });
    };

    // Host Action: Kick User
    const kickUser = (targetSocketId, targetUserId) => {
        socketRef.current?.emit('room:kick-user', { roomId, targetSocketId, targetUserId });
    };

    // Host Action: End Room
    const endRoom = () => {
        socketRef.current?.emit('room:end-room', { roomId });
    };

    return {
        localStream: localStreamRef.current,
        remoteStreams,
        participants,
        messages,
        isMuted,
        isCameraOff,
        isSharingScreen,
        hostId,
        roomEnded,
        toggleMic,
        toggleCamera,
        toggleScreenShare,
        sendMessage,
        kickUser,
        endRoom
    };
};
