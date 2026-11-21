import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    LifeBuoy,
    Megaphone,
    CreditCard,
    Shield,
    Activity,
    RefreshCw,
    LogOut,
    Radio,
    Trash2,
    Database,
    Bell,
    CheckCircle2,
    Sparkles,
    SlidersHorizontal,
    ExternalLink
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import OverviewTab from './components/OverviewTab.jsx';
import UsersTab from './components/UsersTab.jsx';
import QueriesTab from './components/QueriesTab.jsx';
import AdsTab from './components/AdsTab.jsx';
import PaymentsTab from './components/PaymentsTab.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';
import {
    getAdminProfile,
    getAdminStats,
    broadcastAnnouncement,
    flushExpiredSessions
} from './api/admin.api.js';

/**
 * App — Enterprise weeChat Admin Command Center
 * Clean, High-Density, Optimal Architecture
 */
function App() {
    const [adminUser, setAdminUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Broadcast Modal State
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastPriority, setBroadcastPriority] = useState('normal');
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const profile = await getAdminProfile();
            if (profile) {
                setAdminUser(profile);
                loadStats();
            } else {
                setIsLoginOpen(true);
            }
        } catch (err) {
            console.log("No existing session detected in admin portal", err.message);
            setIsLoginOpen(true);
        }
    };

    const loadStats = async () => {
        try {
            setLoadingStats(true);
            const data = await getAdminStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load statistics", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoadingStats(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        setAdminUser(null);
        setIsLoginOpen(true);
        toast.info("Logged out from Admin Command Center");
    };

    const handleBroadcastSubmit = async (e) => {
        e.preventDefault();
        if (!broadcastTitle.trim() || !broadcastMsg.trim()) {
            toast.error("Please enter both announcement title and message");
            return;
        }
        try {
            setIsBroadcasting(true);
            await broadcastAnnouncement(broadcastTitle.trim(), broadcastMsg.trim(), broadcastPriority);
            toast.success("Platform Announcement Broadcasted!", {
                description: `Sent to all live clients via WebSockets`
            });
            setIsBroadcastOpen(false);
            setBroadcastTitle('');
            setBroadcastMsg('');
            loadStats();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Broadcast failed");
        } finally {
            setIsBroadcasting(false);
        }
    };

    const handleFlushSessions = async () => {
        if (!window.confirm("Purge all expired and revoked sessions from MongoDB? Active valid sessions will not be affected.")) return;
        try {
            const res = await flushExpiredSessions();
            toast.success(res.message || "Sessions flushed successfully");
            loadStats();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to flush sessions");
        }
    };

    const tabs = [
        { id: 'overview', label: 'Command & Analytics', icon: LayoutDashboard },
        { id: 'users', label: 'Client Management', icon: Users, badge: stats?.totalUsers || null },
        {
            id: 'queries',
            label: 'Client Queries & Helpdesk',
            icon: LifeBuoy,
            badge: stats?.openQueries ? `${stats.openQueries} Open` : null
        },
        { id: 'ads', label: 'Website Ads Placements', icon: Megaphone },
        { id: 'payments', label: 'Transactions & Gateways', icon: CreditCard }
    ];

    return (
        <div className="min-h-screen bg-[#F6F7F9] dark:bg-[#0A0D14] text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <Toaster position="top-right" richColors />

            {/* Top Enterprise Command Header */}
            <header className="sticky top-0 z-40 h-16 backdrop-blur-2xl bg-white/85 dark:bg-neutral-900/85 border-b border-neutral-200/80 dark:border-neutral-800/80 px-6 flex items-center justify-between shadow-xs transition-colors">
                {/* Left: Branding & Isolated Admin Indicator */}
                <div className="flex items-center gap-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-sm shadow-md">
                            W
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
                                    weeChat Command
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                                    Enterprise Deck
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Live Cluster Heartbeat */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Atlas iw5isxv</span>
                        <span className="text-neutral-400">•</span>
                        <span>{stats?.systemHealth?.database?.pingMs || 24}ms</span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.98% SLA</span>
                    </div>
                </div>

                {/* Right: Quick Action Controls & Administrator Profile */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Broadcast Announcement Button */}
                    <button
                        onClick={() => setIsBroadcastOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200/60 dark:border-blue-900/40 shadow-xs"
                        title="Broadcast alert to all active users"
                    >
                        <Radio className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Broadcast</span>
                    </button>

                    {/* Flush Expired Sessions */}
                    <button
                        onClick={handleFlushSessions}
                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        title="Flush expired and revoked sessions from database"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Purge Expired</span>
                    </button>

                    {/* Refresh Telemetry */}
                    <button
                        onClick={loadStats}
                        className="p-1.5 sm:p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                        title="Refresh Telemetry"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Active Administrator Card */}
                    {adminUser && (
                        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-neutral-200 dark:border-neutral-800">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                {adminUser.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                                    {adminUser.name}
                                </p>
                                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono uppercase font-semibold">
                                    {adminUser.role || 'Superadmin'}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Admin Content Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
                {/* Modern Segmented Navigation Bar */}
                <div className="p-1.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-left shadow-xs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                    isActive
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-black' : 'text-neutral-400'}`} />
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                        isActive
                                            ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Views */}
                <div className="text-left">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            stats={stats}
                            loading={loadingStats}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                            onTriggerBroadcast={() => setIsBroadcastOpen(true)}
                            onTriggerFlush={handleFlushSessions}
                        />
                    )}

                    {activeTab === 'users' && <UsersTab />}

                    {activeTab === 'queries' && <QueriesTab />}

                    {activeTab === 'ads' && <AdsTab />}

                    {activeTab === 'payments' && <PaymentsTab />}
                </div>
            </main>

            {/* Broadcast System Announcement Modal */}
            {isBroadcastOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div
                        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
                                <Radio className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Broadcast Platform Announcement
                                </h3>
                                <p className="text-xs text-neutral-500">Dispatch live notice to all online users across WebRTC and sockets</p>
                            </div>
                        </div>

                        <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1 text-neutral-700 dark:text-neutral-300">
                                    Announcement Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={broadcastTitle}
                                    onChange={(e) => setBroadcastTitle(e.target.value)}
                                    placeholder="e.g. Scheduled Network Upgrade / System Notice"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-neutral-700 dark:text-neutral-300">
                                    Notice Message
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    placeholder="Enter the full message to display in client announcement banners..."
                                    className="w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-neutral-700 dark:text-neutral-300">
                                    Priority Level
                                </label>
                                <select
                                    value={broadcastPriority}
                                    onChange={(e) => setBroadcastPriority(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                >
                                    <option value="normal">Normal (Informational)</option>
                                    <option value="urgent">Urgent (Highlighted Banner)</option>
                                    <option value="critical">Critical (Maintenance Alert)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsBroadcastOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBroadcasting}
                                    className="px-5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    <span>{isBroadcasting ? 'Broadcasting...' : 'Send Live Broadcast'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Standalone Admin Login Modal */}
            <AdminLoginModal
                isOpen={isLoginOpen}
                onLoginSuccess={(user) => {
                    setAdminUser(user);
                    setIsLoginOpen(false);
                    loadStats();
                }}
            />
        </div>
    );
}

export default App;
