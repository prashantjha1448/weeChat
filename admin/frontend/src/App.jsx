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
    LogOut
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import OverviewTab from './components/OverviewTab.jsx';
import UsersTab from './components/UsersTab.jsx';
import QueriesTab from './components/QueriesTab.jsx';
import AdsTab from './components/AdsTab.jsx';
import PaymentsTab from './components/PaymentsTab.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';
import { getAdminProfile, getAdminStats } from './api/admin.api.js';

/**
 * App — Dedicated Standalone weeChat Admin Web Application
 */
function App() {
    const [adminUser, setAdminUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

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
        toast.info("Logged out from Admin Web");
    };

    const tabs = [
        { id: 'overview', label: 'Overview & Demographics', icon: LayoutDashboard },
        { id: 'users', label: 'Clients & Device History', icon: Users, badge: stats?.totalUsers || null },
        {
            id: 'queries',
            label: 'Client Queries & Helpdesk',
            icon: LifeBuoy,
            badge: stats?.openQueries ? `${stats.openQueries} Open` : null
        },
        { id: 'ads', label: 'Website Ads Manager', icon: Megaphone },
        { id: 'payments', label: 'Payments & Gateway IDs', icon: CreditCard }
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0F19] text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <Toaster position="top-right" richColors />

            {/* Admin Header */}
            <header className="sticky top-0 z-40 h-14 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/80 dark:border-neutral-800 px-6 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />
                        </div>
                        <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            weeChat
                        </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider">
                        Dedicated Admin Web
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {adminUser && (
                        <>
                            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                                {adminUser.name} ({adminUser.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Admin Content Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
                            W
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    weeChat Admin Command Center
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider">
                                    {adminUser?.role || 'admin'}
                                </span>
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Dedicated Server :4000 • MongoDB Atlas
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Client Query Resolver • Full Client CRUD • Device & Login Audits • Demographic Analytics • Ad Placements
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            onClick={loadStats}
                            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Refresh Global Stats"
                        >
                            <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-x-auto text-left">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                    isActive
                                        ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-white/40 dark:hover:bg-neutral-700/40'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-black dark:text-white' : 'text-neutral-400'}`} />
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                                        isActive
                                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                                            : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Tab Component */}
                <div className="text-left">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            stats={stats}
                            loading={loadingStats}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                        />
                    )}

                    {activeTab === 'users' && <UsersTab />}

                    {activeTab === 'queries' && <QueriesTab />}

                    {activeTab === 'ads' && <AdsTab />}

                    {activeTab === 'payments' && <PaymentsTab />}
                </div>
            </main>

            {/* Login Modal for Standalone Access */}
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
