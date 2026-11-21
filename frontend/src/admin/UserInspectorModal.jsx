import React, { useState, useEffect } from 'react';
import {
    X,
    Laptop,
    Smartphone,
    Tablet,
    MapPin,
    Clock,
    Shield,
    Video,
    Users,
    MessageSquare,
    Activity,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { getUserDeepDive, revokeUserSession } from './admin.api.js';
import { toast } from 'sonner';

/**
 * UserInspectorModal — Account Device/Login History & Feature Usage Deep-Dive
 */
const UserInspectorModal = ({ userId, isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [revokingId, setRevokingId] = useState(null);

    useEffect(() => {
        if (!isOpen || !userId) return;
        fetchDeepDive();
    }, [isOpen, userId]);

    const fetchDeepDive = async () => {
        try {
            setLoading(true);
            const res = await getUserDeepDive(userId);
            setData(res);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load user deep-dive", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId) => {
        try {
            setRevokingId(sessionId);
            await revokeUserSession(userId, sessionId);
            toast.success("Session revoked successfully");
            fetchDeepDive();
        } catch (err) {
            toast.error("Failed to revoke session", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setRevokingId(null);
        }
    };

    if (!isOpen) return null;

    const user = data?.user;
    const sessions = data?.sessions || [];
    const features = data?.featuresUsage;

    const getDeviceIcon = (deviceType) => {
        if (deviceType === 'Mobile') return <Smartphone className="w-4 h-4 text-neutral-600" />;
        if (deviceType === 'Tablet') return <Tablet className="w-4 h-4 text-neutral-600" />;
        return <Laptop className="w-4 h-4 text-neutral-600" />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold tracking-tight">{user?.name || 'User Inspector'}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    user?.role === 'admin'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                        : user?.role === 'moderator'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}>
                                    {user?.role || 'user'}
                                </span>
                                {user?.isBanned ? (
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold">
                                        BANNED
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Active
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-500 font-mono">@{user?.username} • ID: {user?._id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchDeepDive}
                            disabled={loading}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading && !data ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin" />
                            <p className="text-xs text-neutral-500 font-medium">Gathering device history & feature analytics...</p>
                        </div>
                    ) : (
                        <>
                            {/* Profile Demographics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Email Address</span>
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate" title={user?.email}>
                                        {user?.email || 'N/A'}
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>Mobile / Phone</span>
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                        {user?.mobile_Number || 'Not provided'}
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Age & Gender</span>
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                                        {user?.age ? `${user.age} yrs` : 'Age N/A'} • {user?.gender || 'N/A'}
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>User Trust / Reports</span>
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                        {features?.reportsCount > 0 ? (
                                            <span className="text-amber-600 font-bold">{features.reportsCount} Complaints</span>
                                        ) : (
                                            <span className="text-emerald-600 font-bold">Clean Record (0)</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: Feature Usage Breakdown ("ushne kya use kiya, kitna use kitna, konsa feature zada use kr raha h") */}
                            <div className="p-5 rounded-3xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold tracking-tight">Feature Usage Analytics</h4>
                                        <p className="text-xs text-neutral-500">Activity breakdown and most consumed platform capabilities</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>Primary: {features?.topFeature?.name || '1-on-1 Video Chat'} ({features?.topFeature?.percent}%)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    {/* 1-on-1 Calls */}
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <Video className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase">1-on-1 Video</span>
                                        </div>
                                        <p className="text-2xl font-bold tracking-tight">{features?.oneOnOneCalls?.count || 0}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {features?.oneOnOneCalls?.totalMinutes || 0} total call minutes
                                        </p>
                                    </div>

                                    {/* Custom Rooms */}
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase">Group Lounges</span>
                                        </div>
                                        <p className="text-2xl font-bold tracking-tight">{features?.rooms?.total || 0}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {features?.rooms?.hosted || 0} hosted • {features?.rooms?.joined || 0} joined
                                        </p>
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase">In-Call Messages</span>
                                        </div>
                                        <p className="text-2xl font-bold tracking-tight">{features?.chatMessages?.count || 0}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            Live peer-to-peer messages sent
                                        </p>
                                    </div>
                                </div>

                                {/* Visual Usage Progress Bar */}
                                <div>
                                    <div className="flex justify-between text-xs text-neutral-500 font-medium mb-1.5">
                                        <span>Engagement Distribution</span>
                                        <span>{features?.topFeature?.name} Dominant</span>
                                    </div>
                                    <div className="w-full h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex">
                                        <div
                                            className="h-full bg-blue-500 transition-all"
                                            style={{ width: `${Math.max(10, features?.topFeature?.percent || 50)}%` }}
                                            title="1-on-1 Calls"
                                        />
                                        <div
                                            className="h-full bg-purple-500 transition-all"
                                            style={{ width: '25%' }}
                                            title="Group Rooms"
                                        />
                                        <div
                                            className="h-full bg-emerald-500 transition-all flex-1"
                                            title="Chat"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Account Login & Device History ("ek account kaha kaha login hua h esh user ki history , device konsa , kub login hua , kitne time login tha , lonsa location se tha login") */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="text-sm font-bold tracking-tight">Login & Device History</h4>
                                        <p className="text-xs text-neutral-500">Every active device session, IP address, login timestamp, and geo-location</p>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                        {sessions.length} recorded session{sessions.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                                                <tr>
                                                    <th className="py-3 px-4">Device & Browser</th>
                                                    <th className="py-3 px-4">IP Address</th>
                                                    <th className="py-3 px-4">Location</th>
                                                    <th className="py-3 px-4">Login Time</th>
                                                    <th className="py-3 px-4">Duration</th>
                                                    <th className="py-3 px-4">Status</th>
                                                    <th className="py-3 px-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                                                {sessions.map((sess, idx) => (
                                                    <tr key={sess.id || idx} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                                                    {getDeviceIcon(sess.deviceType)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                                        {sess.deviceLabel}
                                                                    </p>
                                                                    <p className="text-[10px] text-neutral-400 truncate max-w-[180px]" title={sess.deviceRaw}>
                                                                        {sess.deviceType}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                                                            {sess.ip}
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                                <span className="truncate max-w-[140px] font-medium" title={sess.location}>
                                                                    {sess.location}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                                                            {sess.loginAt ? new Date(sess.loginAt).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'N/A'}
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-300 font-semibold">
                                                                <Clock className="w-3 h-3 text-neutral-400" />
                                                                {sess.durationFormatted}
                                                            </span>
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            {sess.status === 'active' ? (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                    Active
                                                                </span>
                                                            ) : sess.status === 'revoked' ? (
                                                                <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold w-fit">
                                                                    Revoked
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold w-fit">
                                                                    Expired
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-3.5 px-4 text-right">
                                                            {sess.status === 'active' && !sess.id?.toString().startsWith('initial_sess_') ? (
                                                                <button
                                                                    onClick={() => handleRevokeSession(sess.id)}
                                                                    disabled={revokingId === sess.id}
                                                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                                                                >
                                                                    {revokingId === sess.id ? 'Revoking...' : 'Revoke'}
                                                                </button>
                                                            ) : (
                                                                <span className="text-neutral-400 text-[11px]">—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 flex justify-between items-center text-xs text-neutral-500">
                    <span>weeChat Admin Inspection Mode • Encrypted WebRTC Session Audit</span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInspectorModal;
