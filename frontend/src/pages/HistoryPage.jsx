import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import api from '../api/axios';

/**
 * HistoryPage — Real Call History View fetching from MongoDB database (/api/calls/history)
 */
const HistoryPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchCallHistory = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await api.get('/calls/history');
            const data = response.data?.data || response.data || [];
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn("Call history fetch error:", err);
            setError(true);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCallHistory();
    }, [fetchCallHistory]);

    // Format Duration (seconds -> 4m 12s)
    const formatDuration = (seconds) => {
        if (!seconds || seconds <= 0) return '< 1m';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    // Format Date using Intl.DateTimeFormat
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recent';
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-left selection:bg-black selection:text-white">
            
            {/* Back Button */}
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer mb-6 group"
            >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Back to Home</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Call History</h1>
                <p className="text-xs text-[#86868B] mt-1 font-normal">
                    Review your recent 1-on-1 random WebRTC video call logs from database
                </p>
            </div>

            {/* Call History Card Container */}
            <div className="w-full bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-100">
                    <h2 className="text-base font-semibold text-[#1D1D1F]">Recent Call Logs</h2>
                    {!loading && !error && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                            {history.length} Sessions Total
                        </span>
                    )}
                </div>

                {/* 1. SKELETON LOADING STATE */}
                {loading && (
                    <div className="flex flex-col gap-4 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-neutral-200 rounded w-32" />
                                        <div className="h-3 bg-neutral-200 rounded w-24" />
                                    </div>
                                </div>
                                <div className="h-6 bg-neutral-200 rounded-full w-20" />
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. ERROR RETRY STATE */}
                {!loading && error && (
                    <div className="py-12 text-center flex flex-col items-center gap-3">
                        <p className="text-xs font-medium text-[#86868B]">Unable to load call history logs from server.</p>
                        <button
                            type="button"
                            onClick={fetchCallHistory}
                            className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* 3. REAL EMPTY STATE */}
                {!loading && !error && history.length === 0 && (
                    <div className="py-12 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold">
                            📞
                        </div>
                        <h3 className="text-sm font-semibold text-[#1D1D1F]">No Call Sessions Yet</h3>
                        <p className="text-xs text-[#86868B] max-w-sm">
                            You haven't made any 1-on-1 video calls. Start matching on the home screen to connect with partners!
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="mt-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                        >
                            Start Matching
                        </button>
                    </div>
                )}

                {/* 4. REAL CALL HISTORY LIST FROM DATABASE */}
                {!loading && !error && history.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {history.map((item) => {
                            const sid = item._id || item.id;
                            
                            // Determine peer user (the partner who is not current user)
                            const currentUserId = user?._id || user?.id;
                            const isUserA = String(item.userA?._id || item.userA?.id || item.userA) === String(currentUserId);
                            const peerUser = isUserA ? item.userB : item.userA;

                            const peerName = typeof peerUser === 'object' ? (peerUser?.name || 'Matched User') : 'Matched Partner';
                            const username = typeof peerUser === 'object' ? (peerUser?.username || 'user') : 'user';
                            const avatar = typeof peerUser === 'object' ? peerUser?.avatar : null;

                            const isSkipped = item.endReason === 'user_skipped' || item.endReason === 'peer_skipped';
                            const statusText = isSkipped ? 'Skipped' : 'Completed';

                            return (
                                <div
                                    key={sid}
                                    className="p-4 sm:p-5 bg-neutral-50/80 border border-neutral-200/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center uppercase overflow-hidden border border-neutral-300 shrink-0">
                                            {avatar ? (
                                                <img src={avatar} alt="Peer Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{peerName.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-[#1D1D1F]">{peerName}</h4>
                                            <p className="text-xs text-[#86868B] mt-0.5">
                                                @{username} • {formatDate(item.startedAt || item.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-medium text-neutral-600 self-end sm:self-center">
                                        <span className="text-[#86868B] font-semibold">{formatDuration(item.duration)}</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                isSkipped
                                                    ? 'bg-neutral-200 text-neutral-700'
                                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                            }`}
                                        >
                                            {statusText}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

        </div>
    );
};

export default HistoryPage;
