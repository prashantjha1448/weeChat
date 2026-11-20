import React, { useRef, useEffect } from 'react';
import { useLocalMedia } from '../hooks/useLocalMedia';
import { useSlot } from '../hooks/useSlot';
import MultiSlotVideoTile from './MultiSlotVideoTile';
import { Mic, MicOff, Video, VideoOff, RefreshCw, AlertCircle, Play, Square } from 'lucide-react';

/**
 * VideoGrid Component
 * Orchestrates 3 independent WebRTC stranger video slots + 1 local preview tile:
 * - Shares single local MediaStream across all 3 slots (no clone)
 * - Handles camera/mic permission denial with clear user feedback
 * - Provides global media controls (Mic, Camera)
 * - Provides batch matchmaking actions (Match All, Leave All)
 */
const VideoGrid = () => {
    const {
        localStream,
        isLoading,
        permissionError,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
        retryMedia
    } = useLocalMedia();

    const slot1 = useSlot(1);
    const slot2 = useSlot(2);
    const slot3 = useSlot(3);

    const localVideoRef = useRef(null);

    // Attach local stream to preview element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    const activeSlotsCount = [slot1, slot2, slot3].filter(s => s.status === 'connected').length;

    const handleMatchAll = () => {
        if (slot1.status === 'idle') slot1.findMatch();
        if (slot2.status === 'idle') slot2.findMatch();
        if (slot3.status === 'idle') slot3.findMatch();
    };

    const handleLeaveAll = () => {
        slot1.leaveSlot();
        slot2.leaveSlot();
        slot3.leaveSlot();
    };

    // Camera/Microphone Permission Denied State
    if (permissionError) {
        return (
            <div className="w-full max-w-lg mx-auto my-auto p-8 rounded-3xl bg-neutral-900 border border-red-500/30 text-center shadow-2xl flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Camera Access Required</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                    {permissionError}
                </p>
                <button
                    type="button"
                    onClick={retryMedia}
                    className="mt-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    // Media Initialization Loading State
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-16 text-center text-neutral-400">
                <div className="w-12 h-12 border-3 border-neutral-700 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-neutral-300">Initializing camera and microphone...</p>
                <p className="text-xs text-neutral-500 mt-1">Configuring 640x360 24fps stream</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Top Toolbar: Active Stats & Quick Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h2 className="text-base sm:text-lg font-bold text-white">Multi-Slot Video Grid</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium">
                        {activeSlotsCount} / 3 Connected
                    </span>
                </div>

                {/* Batch Actions & Device Controls */}
                <div className="flex items-center gap-2">
                    {/* Mic Toggle */}
                    <button
                        type="button"
                        onClick={toggleMute}
                        className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                            isMuted
                                ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                                : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
                        }`}
                        title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                    >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Camera Toggle */}
                    <button
                        type="button"
                        onClick={toggleVideo}
                        className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                            isVideoOff
                                ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                                : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
                        }`}
                        title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                        {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>

                    {/* Quick Batch Match */}
                    <button
                        type="button"
                        onClick={handleMatchAll}
                        className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                    >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Match All</span>
                    </button>

                    {/* Leave All */}
                    {activeSlotsCount > 0 && (
                        <button
                            type="button"
                            onClick={handleLeaveAll}
                            className="px-3.5 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <Square className="w-3 h-3 fill-neutral-400" />
                            <span>Leave All</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Video Tiles Grid: 3 Stranger Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <MultiSlotVideoTile slotState={slot1} />
                <MultiSlotVideoTile slotState={slot2} />
                <MultiSlotVideoTile slotState={slot3} />
            </div>

            {/* Floating / Corner Self-Preview Tile */}
            <div className="fixed bottom-6 right-6 z-40 w-44 sm:w-56 aspect-video bg-neutral-900 rounded-xl overflow-hidden border-2 border-neutral-700 shadow-2xl">
                <div className="relative w-full h-full">
                    {localStream && !isVideoOff ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover -scale-x-100"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 text-xs">
                            <VideoOff className="w-6 h-6 mb-1 text-neutral-500" />
                            <span>Camera Off</span>
                        </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                        You {isMuted && '• Muted'}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VideoGrid;
