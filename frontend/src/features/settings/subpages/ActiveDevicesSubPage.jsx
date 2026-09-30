import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getSessionsApi, revokeSessionApi } from '../settings.api';
import { AppleGroupedList, AppleGroupedRow } from '../components/AppleGroupedList';

const ActiveDevicesSubPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchSessions = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getSessionsApi();
            const data = res.data || res;
            setSessions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Sessions API fetch notice:', err);
            setError(true);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        try {
            await revokeSessionApi(id);
            setSessions((prev) => prev.filter((s) => s.id !== id && s._id !== id));
        } catch (err) {
            console.warn('Revoke session notice:', err);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        try {
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Sub-page Parent Back Link */}
            <button
                onClick={() => navigate('/home/settings/account')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer w-fit"
            >
                <span>‹ Account & Security</span>
            </button>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Active Devices</h1>
                <p className="text-sm text-[#86868B] mt-1 font-normal">
                    Manage sessions where your account is currently signed in
                </p>
            </div>

            {/* Content States */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                    <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center flex flex-col items-center gap-3">
                    <p className="text-xs text-[#86868B]">Unable to load active sessions.</p>
                    <button
                        onClick={fetchSessions}
                        className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold transition-colors"
                    >
                        Try again
                    </button>
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center text-xs text-[#86868B]">
                    No active secondary sessions found.
                </div>
            ) : (
                <AppleGroupedList header="ACTIVE SESSIONS">
                    {sessions.map((session) => {
                        const sid = session.id || session._id;
                        return (
                            <AppleGroupedRow
                                key={sid}
                                label={session.deviceInfo || session.browser || 'Web Browser'}
                                subtitle={`IP: ${session.ip || 'Unknown'} • Active: ${formatDate(session.createdAt)}`}
                                control={
                                    !session.isCurrent && (
                                        <button
                                            type="button"
                                            onClick={() => handleRevoke(sid)}
                                            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-red-50 text-[#1D1D1F] hover:text-red-600 border border-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            Revoke
                                        </button>
                                    )
                                }
                            />
                        );
                    })}
                </AppleGroupedList>
            )}
        </div>
    );
};

export default ActiveDevicesSubPage;
