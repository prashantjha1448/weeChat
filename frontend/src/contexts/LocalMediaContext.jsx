import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const LocalMediaContext = createContext(null);

/**
 * Shared Local Media Provider
 * Captures single getUserMedia stream with constraints:
 *   width: 640, height: 360, frameRate: 24, audio: true
 * Shares exact same MediaStreamTrack references across all 3 RTCPeerConnection slots (no clone).
 * Gracefully handles getUserMedia permission denial.
 */
export const LocalMediaProvider = ({ children }) => {
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [permissionError, setPermissionError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const streamRef = useRef(null);

    const initMedia = useCallback(async () => {
        setIsLoading(true);
        setPermissionError(null);

        try {
            // Stop existing tracks if any before requesting new
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 360 },
                    frameRate: { ideal: 24 }
                },
                audio: true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            setLocalStream(stream);
            setIsLoading(false);
            setPermissionError(null);
        } catch (err) {
            console.error('[LOCAL MEDIA ERROR] Camera/Microphone access failed:', err);
            let userMessage = 'Failed to access camera and microphone.';
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                userMessage = 'Camera/Microphone permission was denied. Please allow access in browser settings to continue.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                userMessage = 'No camera or microphone device found on this system.';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                userMessage = 'Camera or microphone is already in use by another application.';
            }

            setPermissionError(userMessage);
            setIsLoading(false);
            setLocalStream(null);
        }
    }, []);

    useEffect(() => {
        initMedia();

        return () => {
            // Cleanup shared local tracks on complete unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [initMedia]);

    // Toggle Microphone across all slots
    const toggleMute = useCallback(() => {
        if (!streamRef.current) return;
        const audioTracks = streamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
            const nextState = !audioTracks[0].enabled;
            audioTracks.forEach(t => { t.enabled = nextState; });
            setIsMuted(!nextState);
        }
    }, []);

    // Toggle Camera across all slots
    const toggleVideo = useCallback(() => {
        if (!streamRef.current) return;
        const videoTracks = streamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
            const nextState = !videoTracks[0].enabled;
            videoTracks.forEach(t => { t.enabled = nextState; });
            setIsVideoOff(!nextState);
        }
    }, []);

    const value = {
        localStream,
        isLoading,
        permissionError,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
        retryMedia: initMedia
    };

    return (
        <LocalMediaContext.Provider value={value}>
            {children}
        </LocalMediaContext.Provider>
    );
};

export const useLocalMediaContext = () => {
    const ctx = useContext(LocalMediaContext);
    if (!ctx) {
        throw new Error('useLocalMediaContext must be used within a LocalMediaProvider');
    }
    return ctx;
};
