import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LocalMediaProvider } from '../contexts/LocalMediaContext';
import VideoGrid from '../components/VideoGrid';
import { connectSocket, getSocket } from '../services/socket.service';
import { ArrowLeft, Users } from 'lucide-react';

/**
 * MultiSlotPage
 * Page hosting the 3-Stranger WebRTC Grid.
 * Wraps VideoGrid in LocalMediaProvider so camera & mic are requested once and shared across all slots.
 */
const MultiSlotPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure socket is initialized and connected
        connectSocket();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-neutral-800">
            {/* Top Navigation Bar */}
            <header className="w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                            Triple Stranger Live Video
                        </h1>
                    </div>

                    <div className="text-xs text-neutral-500 hidden sm:block">
                        3 Independent Strangers • P2P Mesh
                    </div>
                </div>
            </header>

            {/* Main Video Grid Area */}
            <main className="flex-1 flex flex-col justify-center py-6 sm:py-8">
                <LocalMediaProvider>
                    <VideoGrid />
                </LocalMediaProvider>
            </main>

            {/* Footer Notice */}
            <footer className="py-3 text-center text-xs text-neutral-600 border-t border-neutral-900">
                Omegle-style Multi-Slot WebRTC Mesh • Low Latency • Adaptive Bitrate
            </footer>
        </div>
    );
};

export default MultiSlotPage;
