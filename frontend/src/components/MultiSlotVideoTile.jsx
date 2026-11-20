import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, SkipForward, UserX, Flag, Wifi, WifiOff } from 'lucide-react';

/**
 * MultiSlotVideoTile
 * Renders an individual stranger video slot:
 * - Remote video stream attached
 * - Remote audio muted by default with per-tile toggle
 * - Adaptive quality tier and bandwidth badge
 * - Per-slot controls: Next, Leave, Report
 */
const MultiSlotVideoTile = ({ slotState }) => {
    const {
        slot,
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
    } = slotState;

    const videoRef = useRef(null);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState('inappropriate_behavior');

    // Attach remote stream to HTML5 video element
    useEffect(() => {
        if (videoRef.current) {
            if (remoteStream) {
                videoRef.current.srcObject = remoteStream;
            } else {
                videoRef.current.srcObject = null;
            }
        }
    }, [remoteStream]);

    const handleConfirmReport = () => {
        report(reportReason);
        setShowReportDialog(false);
    };

    return (
        <div className="relative w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col justify-between group">
            
            {/* Top Bar: Slot Identifier & Adaptive Quality Badge */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/10">
                        Slot {slot}
                    </span>

                    {/* Status Badge */}
                    {status === 'searching' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Searching...
                        </span>
                    )}
                    {status === 'connecting' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                            Connecting...
                        </span>
                    )}
                    {status === 'connected' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Live
                        </span>
                    )}
                    {status === 'idle' && (
                        <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium">
                            Idle
                        </span>
                    )}
                </div>

                {/* Realtime Adaptive Quality Indicator */}
                {status === 'connected' && stats && (
                    <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/90 border border-white/10 text-xs flex items-center gap-1.5">
                        {stats.isVideoActive === false ? (
                            <span className="text-red-400 flex items-center gap-1">
                                <WifiOff className="w-3 h-3" /> Audio Only (Low BW)
                            </span>
                        ) : (
                            <>
                                <Wifi className="w-3 h-3 text-emerald-400" />
                                <span className="font-semibold text-emerald-300">{stats.tier}</span>
                                <span className="text-white/40">•</span>
                                <span>{stats.perPeerKbps} kbps</span>
                                {stats.rtt !== null && (
                                    <>
                                        <span className="text-white/40">•</span>
                                        <span className="text-white/70">{stats.rtt}ms</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Video Canvas or Empty/Searching Placeholder */}
            <div className="relative w-full h-full flex items-center justify-center">
                {remoteStream && status === 'connected' ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={isRemoteMuted}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                        {status === 'searching' ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-2 border-neutral-700 border-t-amber-400 rounded-full animate-spin" />
                                <p className="text-sm text-neutral-300 font-medium">Matching with a stranger...</p>
                            </div>
                        ) : status === 'connecting' ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-2 border-neutral-700 border-t-blue-400 rounded-full animate-spin" />
                                <p className="text-sm text-neutral-300 font-medium">Establishing WebRTC connection...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                                    <UserX className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-300">Slot {slot} is Open</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">Click Start to connect with a random person</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={findMatch}
                                    className="mt-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                                >
                                    Start Slot {slot}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message if Any */}
            {error && (
                <div className="absolute top-12 left-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs text-center backdrop-blur-md">
                    {error}
                </div>
            )}

            {/* Bottom Controls Bar (Visible on Hover or Active Call) */}
            {status !== 'idle' && (
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
                    {/* Left: Unmute/Mute Toggle (Remote tiles muted by default) */}
                    {status === 'connected' ? (
                        <button
                            type="button"
                            onClick={toggleRemoteMute}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                                isRemoteMuted
                                    ? 'bg-red-500/30 text-red-300 border-red-500/40 hover:bg-red-500/40'
                                    : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
                            }`}
                            title={isRemoteMuted ? "Unmute stranger's audio" : "Mute stranger's audio"}
                        >
                            {isRemoteMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    ) : <div />}

                    {/* Right: Slot Controls */}
                    <div className="flex items-center gap-2">
                        {status === 'connected' && (
                            <button
                                type="button"
                                onClick={() => setShowReportDialog(true)}
                                className="p-2 rounded-full bg-neutral-800/80 hover:bg-red-900/60 text-neutral-400 hover:text-red-300 border border-white/5 transition-all cursor-pointer"
                                title="Report & block stranger"
                            >
                                <Flag className="w-4 h-4" />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={next}
                            className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                            title="Skip to next stranger on this slot"
                        >
                            <SkipForward className="w-3.5 h-3.5" />
                            <span>Next</span>
                        </button>

                        <button
                            type="button"
                            onClick={leaveSlot}
                            className="px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-all cursor-pointer"
                            title="Leave this slot"
                        >
                            Leave
                        </button>
                    </div>
                </div>
            )}

            {/* Report Confirmation Modal */}
            {showReportDialog && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm flex flex-col justify-center items-center p-6 text-center">
                    <Flag className="w-8 h-8 text-red-400 mb-2" />
                    <h4 className="text-white text-sm font-bold">Report & Block Stranger</h4>
                    <p className="text-neutral-400 text-xs mt-1 mb-4">
                        This user will be permanently blocked both ways and you will never match again.
                    </p>
                    <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full mb-4 px-3 py-2 rounded-lg bg-neutral-800 text-white text-xs border border-neutral-700 focus:outline-none"
                    >
                        <option value="inappropriate_behavior">Inappropriate Behavior</option>
                        <option value="harassment">Harassment / Bullying</option>
                        <option value="spam">Spam or Bot</option>
                        <option value="underage">Underage User</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="flex items-center gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => setShowReportDialog(false)}
                            className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmReport}
                            className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                        >
                            Block & Next
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MultiSlotVideoTile;
