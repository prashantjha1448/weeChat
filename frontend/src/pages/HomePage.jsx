import React, { useEffect, useRef, useState } from 'react';
import VideoCallScreen from '../components/VideoCallScreen';
import { useSelector } from 'react-redux';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { prewarmMedia } from '../hooks/useWebRTC';
import { Video, Sparkles, X, Users } from 'lucide-react';
import { GlassCard, GlassButton } from '../components/glass';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const [previewStream, setPreviewStream] = useState(null);
    const previewVideoRef = useRef(null);

    const {
        queueState,
        matchedPeer,
        callRoomId,
        isCaller,
        matchScore,
        joinQueue,
        leaveQueue
    } = useMatchmaking();

    // Attach local camera stream to preview during searching
    useEffect(() => {
        if (queueState === 'waiting') {
            prewarmMedia().then((stream) => {
                if (stream) {
                    setPreviewStream(stream);
                    if (previewVideoRef.current) {
                        previewVideoRef.current.srcObject = stream;
                    }
                }
            });
        }
    }, [queueState]);

    useEffect(() => {
        if (previewVideoRef.current && previewStream) {
            previewVideoRef.current.srcObject = previewStream;
        }
    }, [previewStream]);

    const handleStartClick = () => {
        // Pre-warm camera immediately on button press for 0ms call setup
        prewarmMedia();
        joinQueue();
    };

    const handleNextSkip = () => {
        joinQueue();
    };

    return (
        <div className="w-full min-h-[calc(100dvh-4rem)] text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col items-center justify-center selection:bg-black selection:text-white px-4 py-6 relative overflow-hidden">
            
            {/* 1. In-Call View — Fullscreen 1-on-1 Video Chat Screen */}
            {queueState === 'matched' && callRoomId ? (
                <VideoCallScreen
                    roomId={callRoomId}
                    isCaller={isCaller}
                    matchedPeer={matchedPeer}
                    matchScore={matchScore}
                    onSkip={handleNextSkip}
                    onEnd={leaveQueue}
                />
            ) : (
                /* 2. Matchmaking Lobby View */
                <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center my-auto relative z-10">
                    
                    {/* Live Online Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold tracking-wide">
                            Instant Random Video Chat
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3 leading-tight">
                        Welcome back, <span className="text-neutral-500">{user?.name || 'Friend'}</span>
                    </h1>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed font-normal">
                        Connect instantly for 1-on-1 random WebRTC video calls with partners across the globe.
                    </p>

                    {/* Searching State with Live Camera Preview & Glass Container */}
                    {queueState === 'waiting' ? (
                        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-neutral-800">
                            
                            {/* Background Camera Preview (Subtle / Live) */}
                            {previewStream ? (
                                <video
                                    ref={previewVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-40 blur-xs"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-md" />
                            )}

                            {/* Foreground Frosted Glass Card */}
                            <div className="relative z-10 p-8 sm:p-10 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl text-center flex flex-col items-center gap-5 animate-in fade-in">
                                
                                <div className="relative flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full border-3 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white animate-spin" />
                                    <Sparkles className="w-6 h-6 text-neutral-900 dark:text-white absolute animate-pulse" />
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                                        Looking for someone online...
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                                        Camera is ready. Pairing with the next stranger...
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={leaveQueue}
                                    className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold cursor-pointer transition-all active:scale-95"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Cancel Search</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Idle State — Fast Start Button */
                        <div className="w-full flex flex-col items-center gap-4">
                            <button
                                type="button"
                                onClick={handleStartClick}
                                className="w-full max-w-md py-4.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-base sm:text-lg transition-all active:scale-[0.98] shadow-2xl hover:opacity-90 cursor-pointer flex items-center justify-center gap-3 group"
                            >
                                <Video className="w-5 h-5" />
                                <span>Start 1-on-1 Matchmaking</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>

                            <p className="text-xs text-neutral-400 font-medium">
                                Press Spacebar in-call to instantly skip to the next stranger
                            </p>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default Home;
