import React from 'react';
import VideoCallScreen from '../components/VideoCallScreen';
import { useSelector } from 'react-redux';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { Video, Sparkles, X } from 'lucide-react';

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const {
        queueState,
        matchedPeer,
        callRoomId,
        isCaller,
        matchScore,
        joinQueue,
        leaveQueue
    } = useMatchmaking();

    const handleNextSkip = () => {
        // Immediately re-queue user for the next online stranger (< 150ms shuffle)
        joinQueue();
    };

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] text-neutral-900 font-sans antialiased flex flex-col items-center justify-center selection:bg-black selection:text-white px-4 py-8">
            
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
                <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center my-auto">
                    
                    {/* Live Online Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-emerald-700 tracking-wide">
                            Instant Random Video Chat
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-3 leading-tight">
                        Welcome back, <span className="text-neutral-500">{user?.name || 'Friend'}</span>
                    </h1>

                    <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed font-normal">
                        Click below to instantly connect and shuffle with random online strangers across the globe.
                    </p>

                    {/* Searching State */}
                    {queueState === 'waiting' ? (
                        <div className="w-full p-10 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl text-center flex flex-col items-center gap-5 animate-in fade-in">
                            <div className="relative flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border-4 border-neutral-100 border-t-black animate-spin" />
                                <Sparkles className="w-6 h-6 text-neutral-900 absolute" />
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900">
                                    Looking for someone online...
                                </h3>
                                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                                    As soon as anyone clicks Start, you'll be paired instantly.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={leaveQueue}
                                className="inline-flex items-center gap-1.5 mt-2 px-5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-neutral-500" />
                                <span>Cancel Search</span>
                            </button>
                        </div>
                    ) : (
                        /* Idle State — Big Start Button */
                        <div className="w-full flex flex-col items-center gap-4">
                            <button
                                type="button"
                                onClick={joinQueue}
                                className="w-full max-w-md py-4.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-lg transition-all active:scale-[0.98] shadow-2xl shadow-black/20 cursor-pointer flex items-center justify-center gap-3 group"
                            >
                                <Video className="w-5 h-5" />
                                <span>Start Random Video Chat</span>
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
