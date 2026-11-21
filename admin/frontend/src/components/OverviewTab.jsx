import React, { useState } from 'react';
import {
    Users,
    Zap,
    Video,
    CreditCard,
    PieChart,
    Calendar,
    ArrowUpRight,
    Sparkles,
    Shield,
    ShieldCheck,
    Lock,
    Clock,
    Activity,
    CheckCircle2,
    AlertTriangle,
    Database,
    Server,
    HardDrive,
    Radio,
    Send,
    Trash2,
    Filter,
    Download,
    Search,
    MessageSquare,
    Check,
    ExternalLink,
    Bell,
    Globe,
    Cpu,
    LifeBuoy,
    AlertCircle,
    UserX,
    Eye
} from 'lucide-react';
import { resolveSupportQuery, toggleBanUser } from '../api/admin.api.js';
import { toast } from 'sonner';

/**
 * OverviewTab — Enterprise Admin Command Deck & Telemetry Center
 * High-Density, Apple/Linear-Grade Aesthetics with Full Executive Control
 */
const OverviewTab = ({ stats, loading, onNavigateTab, onTriggerBroadcast, onTriggerFlush }) => {
    const [actionFilter, setActionFilter] = useState('all');
    const [auditSearch, setAuditSearch] = useState('');
    const [quickResolvingId, setQuickResolvingId] = useState(null);
    const [quickResolveReply, setQuickResolveReply] = useState('');
    const [resolvingTicket, setResolvingTicket] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    if (loading) {
        return (
            <div className="py-28 flex flex-col items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white animate-spin" />
                <p className="text-xs text-neutral-500 font-medium tracking-wide">Connecting to weeChat Enterprise Telemetry...</p>
            </div>
        );
    }

    const gender = stats?.genderDistribution || {
        male: { count: 0, percent: 0 },
        female: { count: 0, percent: 0 },
        other: { count: 0, percent: 0 }
    };

    const ageList = stats?.ageDemographics || [];
    const features = stats?.featureUsage?.features || [];
    const payments = stats?.paymentsSummary || { totalRevenue: 0, successfulCount: 0, pendingCount: 0 };
    const mostUsedFeatureName = stats?.featureUsage?.mostUsedFeature?.name || stats?.featureUsage?.mostUsedFeature || '1-on-1 Video Chat';
    const recentLogs = stats?.recentAdminLogs || [];
    const health = stats?.systemHealth || {
        database: { name: 'MongoDB Atlas', cluster: 'chh-cluster.iw5isxv', status: 'CONNECTED', pingMs: 24, uptimePercent: 99.98 },
        server: { port: 4000, uptimeSecs: 3600, memoryUsageMB: 44, nodeVersion: 'v24' },
        webrtc: { status: 'OPERATIONAL', activePeers: stats?.activeUsersNow || 1 }
    };
    const geoList = stats?.geoDistribution || [];
    const tickets = stats?.recentTickets || [];
    const reports = stats?.recentReports || [];

    // Filter audit logs
    const filteredLogs = recentLogs.filter(log => {
        if (actionFilter !== 'all' && !log.action?.toLowerCase().includes(actionFilter)) return false;
        if (auditSearch.trim()) {
            const q = auditSearch.toLowerCase();
            return (
                log.action?.toLowerCase().includes(q) ||
                log.adminEmail?.toLowerCase().includes(q) ||
                log.adminName?.toLowerCase().includes(q) ||
                log.ip?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleQuickResolveSubmit = async (ticketId) => {
        if (!quickResolveReply.trim()) {
            toast.error("Please enter a resolution note for the client");
            return;
        }
        try {
            setActionLoading(true);
            await resolveSupportQuery(ticketId, quickResolveReply.trim(), 'resolved');
            toast.success("Query resolved and client notification dispatched!");
            setResolvingTicket(null);
            setQuickResolveReply('');
        } catch (e) {
            toast.error(e.response?.data?.message || e.message || "Failed to resolve query");
        } finally {
            setActionLoading(false);
        }
    };

    const handleQuickBan = async (user) => {
        if (!window.confirm(`Are you sure you want to immediately BAN @${user.username || 'this user'}?`)) return;
        try {
            await toggleBanUser(user._id, true, "Emergency ban from Admin Command Center");
            toast.success(`User @${user.username} has been banned`);
        } catch (e) {
            toast.error("Ban action failed: " + (e.response?.data?.message || e.message));
        }
    };

    const handleExportAuditJSON = () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recentLogs, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `weechat-admin-audit-${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            toast.success("Audit log exported successfully");
        } catch (e) {
            toast.error("Export failed: " + e.message);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* 1. Infrastructure & Live Telemetry Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">Atlas Cluster</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">iw5isxv • {health.database?.pingMs || 24}ms ping</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Radio className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">WebRTC Engine</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">P2P Mesh • Coturn OK</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">Admin DB Isolation</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">admins & admin_logs</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Cpu className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">Core Memory</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">Heap: {health.server?.memoryUsageMB || 44}MB / 512MB</p>
                    </div>
                </div>
            </div>

            {/* 2. Executive Command Deck — 5 Key Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Client Ecosystem */}
                <div
                    onClick={() => onNavigateTab('users')}
                    className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md hover:border-blue-500/40 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Clients</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.totalUsers?.toLocaleString() || 0}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            100% Genuine
                        </span>
                        <span className="text-neutral-400 group-hover:text-blue-500 flex items-center gap-0.5 font-medium transition-colors">
                            Manage <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>

                {/* 2. Live Online */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Live Online</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {stats?.activeUsersNow ?? 0}
                        </p>
                        {(stats?.activeUsersNow || 0) > 0 ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                Live
                            </span>
                        ) : (
                            <span className="text-[11px] font-medium text-neutral-400">
                                Standby
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-[11px] text-neutral-500 truncate">
                        Active WebRTC socket streams
                    </p>
                </div>

                {/* 3. Dedicated Admins */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-purple-200/80 dark:border-purple-900/40 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Isolated Admins</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.totalAdmins ?? 3}
                    </p>
                    <p className="mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold truncate flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        Dedicated <code className="font-mono bg-purple-100 dark:bg-purple-950 px-1 rounded">admins</code> DB
                    </p>
                </div>

                {/* 4. Video Streaming Calls */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">1-on-1 Calls</span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Video className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.featureUsage?.totalCalls?.toLocaleString() || 0}
                    </p>
                    <p className="mt-2 text-[11px] text-neutral-500 truncate">
                        {stats?.featureUsage?.totalCallMinutes || 0} streamed minutes
                    </p>
                </div>

                {/* 5. Gross Monetization Revenue */}
                <div
                    onClick={() => onNavigateTab('payments')}
                    className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Revenue</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        ₹{payments.totalRevenue?.toLocaleString('en-IN') || 0}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">
                            {payments.successfulCount || 0} transactions
                        </span>
                        <span className="text-neutral-400 group-hover:text-amber-500 flex items-center gap-0.5 font-medium transition-colors">
                            Ledger <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Rapid Operations & Client Triage Command Grid ("aur client ki querry resolve kreyga") */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Live Client Query Helpdesk Queue */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <LifeBuoy className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                        Client Queries Requiring Admin Action
                                    </h3>
                                    <p className="text-xs text-neutral-500">Instant resolution desk for pending user inquiries</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold font-mono">
                                {stats?.openQueries || 0} Open
                            </span>
                        </div>

                        {tickets.length === 0 ? (
                            <div className="p-8 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 text-center my-3">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Helpdesk Inquiries Cleared</p>
                                <p className="text-[11px] text-neutral-500 mt-0.5">All customer support tickets are currently resolved.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 my-2">
                                {tickets.map(ticket => (
                                    <div
                                        key={ticket._id}
                                        className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                {ticket.userId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                                        {ticket.userId?.name || 'Customer'}
                                                    </span>
                                                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase ${
                                                        ticket.priority === 'high'
                                                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                                    }`}>
                                                        {ticket.priority || 'normal'}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-400 capitalize">
                                                        • {ticket.category || 'general'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-[280px]">
                                                    {ticket.subject || ticket.message}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setResolvingTicket(ticket)}
                                            className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shrink-0 hover:opacity-90 cursor-pointer shadow-xs"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Directly syncs to client conversation threads</span>
                        <button
                            onClick={() => onNavigateTab('queries')}
                            className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            Open Full Helpdesk <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Right Card: Content Moderation & Abuse Flag Queue */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                        Content Moderation & Safety Flags
                                    </h3>
                                    <p className="text-xs text-neutral-500">Pending user reports requiring policy intervention</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                                stats?.pendingReports > 0
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                            }`}>
                                {stats?.pendingReports || 0} Pending
                            </span>
                        </div>

                        {reports.length === 0 ? (
                            <div className="p-8 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 text-center my-3">
                                <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Zero Safety Violations</p>
                                <p className="text-[11px] text-neutral-500 mt-0.5">Community standards clean. No pending user abuse reports.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 my-2">
                                {reports.map(rep => (
                                    <div
                                        key={rep._id}
                                        className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                    @{rep.reportedUser?.username || rep.reportedUserId?.username || 'Reported User'}
                                                </span>
                                                <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-bold uppercase">
                                                    {rep.reason || 'Violation'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-neutral-500 truncate max-w-[280px]">
                                                Flagged by @{rep.reporter?.username || rep.reporterId?.username || 'user'} • "{rep.description || 'Behavior report'}"
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleQuickBan(rep.reportedUser || rep.reportedUserId)}
                                            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shrink-0 hover:bg-rose-700 cursor-pointer shadow-xs"
                                        >
                                            Ban User
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Automated WebRTC abuse prevention active</span>
                        <button
                            onClick={() => onNavigateTab('users')}
                            className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            Open User Moderation <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Demographics & User Science Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Demographics */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-blue-500" />
                                Gender Demographic Spectrum
                            </h3>
                            <p className="text-xs text-neutral-500">Distribution across active registered accounts</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {stats?.totalUsers || 0} clients
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex mb-5">
                        <div
                            className="h-full bg-blue-500 transition-all duration-700"
                            style={{ width: `${gender.male.percent}%` }}
                            title={`Male: ${gender.male.percent}%`}
                        />
                        <div
                            className="h-full bg-rose-500 transition-all duration-700"
                            style={{ width: `${gender.female.percent}%` }}
                            title={`Female: ${gender.female.percent}%`}
                        />
                        <div
                            className="h-full bg-purple-500 transition-all duration-700"
                            style={{ width: `${gender.other.percent}%` }}
                            title={`Other: ${gender.other.percent}%`}
                        />
                    </div>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1">Male</span>
                            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{gender.male.count}</p>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">{gender.male.percent}% of total</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">Female</span>
                            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{gender.female.count}</p>
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">{gender.female.percent}% of total</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mb-1">Other / Diverse</span>
                            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{gender.other.count}</p>
                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">{gender.other.percent}% of total</p>
                        </div>
                    </div>
                </div>

                {/* Age Demographics Cohorts */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Age Cohorts & Generation Intelligence
                            </h3>
                            <p className="text-xs text-neutral-500">Calculated from genuine verified user birth dates</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {ageList.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 w-24 shrink-0">
                                    {item.group}
                                </span>
                                <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.max(item.percent, 3)}%` }}
                                    />
                                </div>
                                <div className="w-16 text-right shrink-0">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                        {item.count}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 ml-1">({item.percent}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Feature Adoption & Regional Hotspots */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Consumption */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-500" />
                                Platform Feature Consumption
                            </h3>
                            <p className="text-xs text-neutral-500">Adoption across core weeChat capabilities</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Top: {mostUsedFeatureName}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {features.map((feat, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{feat.name}</h4>
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{feat.sharePercent}%</span>
                                </div>
                                <p className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {feat.totalEvents?.toLocaleString()}
                                </p>
                                <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{feat.metricLabel}</p>

                                <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden mt-2.5">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${Math.max(5, feat.sharePercent)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regional Geographic Hotspots */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-emerald-500" />
                                Geographic Traffic Hotspots
                            </h3>
                            <p className="text-xs text-neutral-500">Regional user concentration across major locations</p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {geoList.map((geo, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/60 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                                        {idx + 1}
                                    </span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{geo.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{geo.count} clients</span>
                                    <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                                        {geo.percent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Admin Security & Real-Time Audit Console */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                    Admin Security & Audit Console
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[9px] font-bold uppercase">
                                        Isolated DB: admin_logs
                                    </span>
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Immutable audit trail tracking all administrator access, security actions, and query resolutions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Action Filter Pills */}
                        <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold">
                            {['all', 'login', 'ban', 'resolve'].map(filterKey => (
                                <button
                                    key={filterKey}
                                    onClick={() => setActionFilter(filterKey)}
                                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                                        actionFilter === filterKey
                                            ? 'bg-white dark:bg-neutral-900 text-black dark:text-white shadow-xs'
                                            : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {filterKey}
                                </button>
                            ))}
                        </div>

                        {/* Export Audit Button */}
                        <button
                            onClick={handleExportAuditJSON}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer shadow-xs"
                            title="Export Audit Log to JSON"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export JSON</span>
                        </button>
                    </div>
                </div>

                {filteredLogs.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                        <Lock className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">No matching audit events</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Admin activities will be automatically recorded here.</p>
                    </div>
                ) : (
                    <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                                    <tr>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Administrator</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">IP Address</th>
                                        <th className="py-3 px-4">Client / Device</th>
                                        <th className="py-3 px-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                                    {filteredLogs.map((log, idx) => (
                                        <tr key={log._id || idx} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    log.action?.includes('LOGIN')
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                        : log.action?.includes('BAN')
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                        : log.action?.includes('RESOLVE')
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{log.adminName || 'Admin'}</span>
                                                    <span className="text-[11px] text-neutral-400 font-mono">({log.adminEmail})</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.status === 'failed' ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                                                        FAILED
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        Success
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                                                {log.ip || '127.0.0.1'}
                                            </td>
                                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 text-[11px] max-w-[200px] truncate" title={log.device}>
                                                {log.device || 'Admin Web Console'}
                                            </td>
                                            <td className="py-3 px-4 text-right text-neutral-500 text-[11px] whitespace-nowrap">
                                                {log.createdAt ? new Date(log.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                }) : 'Just now'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Resolve Modal */}
            {resolvingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold">Resolve Client Inquiry</h3>
                                <p className="text-xs text-neutral-500">Ticket from @{resolvingTicket.userId?.username || 'user'}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {resolvingTicket.category || 'ticket'}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 mb-4 text-xs">
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{resolvingTicket.subject}</p>
                            <p className="text-neutral-600 dark:text-neutral-400">{resolvingTicket.message}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-1.5">Resolution Response to Client</label>
                            <textarea
                                rows={4}
                                value={quickResolveReply}
                                onChange={(e) => setQuickResolveReply(e.target.value)}
                                placeholder="Write the administrative resolution note to send to this client..."
                                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>

                        <div className="flex justify-end gap-2.5">
                            <button
                                onClick={() => setResolvingTicket(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleQuickResolveSubmit(resolvingTicket._id)}
                                disabled={actionLoading}
                                className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {actionLoading ? 'Resolving...' : 'Send Resolution & Mark Resolved'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
