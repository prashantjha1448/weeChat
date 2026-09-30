import { useState, useEffect, useRef, useCallback } from 'react';

export const useMediaPreview = (selectedCameraId, selectedMicId) => {
    const [previewState, setPreviewState] = useState('idle'); // 'idle' | 'requesting' | 'live' | 'denied' | 'no-device' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [autoStoppedNotice, setAutoStoppedNotice] = useState(false);
    const [micVolume, setMicVolume] = useState(0);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const animFrameRef = useRef(null);
    const autoStopTimerRef = useRef(null);
    const currentRequestIdRef = useRef(0);

    // Stop all media tracks, audio nodes, timers & reset refs
    const stopPreview = useCallback(() => {
        // Increment request ID to cancel any pending async getUserMedia resolution
        currentRequestIdRef.current += 1;

        // Clear auto-stop timer
        if (autoStopTimerRef.current) {
            clearTimeout(autoStopTimerRef.current);
            autoStopTimerRef.current = null;
        }

        // Cancel audio analyzer animation frame
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }

        // Close AudioContext
        if (audioContextRef.current) {
            try {
                audioContextRef.current.close();
            } catch {
                // Ignore if already closed
            }
            audioContextRef.current = null;
        }

        // Stop media stream tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                try {
                    track.stop();
                } catch {
                    // Ignore track stop errors
                }
            });
            streamRef.current = null;
        }

        // Detach video srcObject
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setMicVolume(0);
        setPreviewState('idle');
    }, []);

    // Start preview stream
    const startPreview = useCallback(async () => {
        // Stop any existing stream first
        stopPreview();

        const requestId = currentRequestIdRef.current;
        setPreviewState('requesting');
        setErrorMessage('');
        setAutoStoppedNotice(false);

        try {
            const constraints = {
                video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
                audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // React StrictMode & Async Safety: If unmounted or stop requested while getUserMedia was pending
            if (currentRequestIdRef.current !== requestId) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setPreviewState('live');

            // Setup Real Mic Level Meter with Web Audio API (AudioContext + AnalyserNode)
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack && (window.AudioContext || window.webkitAudioContext)) {
                try {
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    const audioCtx = new AudioContextClass();
                    audioContextRef.current = audioCtx;

                    const source = audioCtx.createMediaStreamSource(stream);
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 64;
                    source.connect(analyser);

                    const dataArray = new Uint8Array(analyser.frequencyBinCount);

                    const updateMicVolume = () => {
                        if (currentRequestIdRef.current !== requestId) return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < dataArray.length; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / dataArray.length;
                        const volumePercent = Math.min(100, Math.round((average / 128) * 100));
                        setMicVolume(volumePercent);
                        animFrameRef.current = requestAnimationFrame(updateMicVolume);
                    };

                    updateMicVolume();
                } catch (audioErr) {
                    console.warn('AudioContext meter setup failed', audioErr);
                }
            }

            // Auto turn-off after 60 seconds
            autoStopTimerRef.current = setTimeout(() => {
                if (currentRequestIdRef.current === requestId) {
                    stopPreview();
                    setAutoStoppedNotice(true);
                }
            }, 60000);

        } catch (err) {
            if (currentRequestIdRef.current !== requestId) return;

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setPreviewState('denied');
                setErrorMessage('Allow camera and microphone access in browser settings.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setPreviewState('no-device');
                setErrorMessage('No camera or microphone device found.');
            } else {
                setPreviewState('error');
                setErrorMessage(err.message || 'Failed to start camera preview.');
            }
        }
    }, [selectedCameraId, selectedMicId, stopPreview]);

    // Handle 1. Component Unmount / Route Change & 2. Window/Tab Visibility & Unload Events
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPreview();
            }
        };

        const handlePageHide = () => {
            stopPreview();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('beforeunload', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
            window.removeEventListener('beforeunload', handlePageHide);
            stopPreview(); // Unmount cleanup
        };
    }, [stopPreview]);

    return {
        videoRef,
        previewState,
        errorMessage,
        autoStoppedNotice,
        micVolume,
        startPreview,
        stopPreview
    };
};
