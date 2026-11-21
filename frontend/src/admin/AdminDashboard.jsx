import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
    LayoutDashboard,
    Users,
    Megaphone,
    CreditCard,
    ArrowLeft,
    Shield,
    Activity,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import OverviewTab from './OverviewTab.jsx';
import UsersTab from './UsersTab.jsx';
import AdsTab from './AdsTab.jsx';
import PaymentsTab from './PaymentsTab.jsx';
import { getAdminStats } from './admin.api.js';
import { toast } from 'sonner';

/**
 * AdminDashboard — Master weeChat Admin & Moderation Command Center
 * Mode: Full Admin Glassmorphic Web App
 */
const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'ads' | 'payments'
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await getAdminStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load platform stats", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview & Demographics', icon: LayoutDashboard },
        { id: 'users', label: 'Clients & Device History', icon: Users, badge: stats?.totalUsers || null },
        { id: 'ads', label: 'Website Ads Manager', icon: Megaphone },
        { id: 'payments', label: 'Payments & Gateway IDs', icon: CreditCard }
    ];

    return (
        <div className="w-full text-left space-y-6">
            {/* Top Admin Navigation & Welcome Hero */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
                        W
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                weeChat Admin Web
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider">
                                {user?.role || 'admin'}
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live DB Connected
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Logged in as <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user?.name}</span> ({user?.email}) • Full CRUD, Ad Placements, Demographics & Device Tracking
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        onClick={loadStats}
                        className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Refresh Global Stats"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to App</span>
                    </button>
                </div>
            </div>

            {/* Apple-Style Glass Tab Bar */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-x-auto">
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

            {/* Active Tab View */}
            <main>
                {activeTab === 'overview' && (
                    <OverviewTab
                        stats={stats}
                        loading={loading}
                        onNavigateTab={(tab) => setActiveTab(tab)}
                    />
                )}

                {activeTab === 'users' && <UsersTab />}

                {activeTab === 'ads' && <AdsTab />}

                {activeTab === 'payments' && <PaymentsTab />}
            </main>
        </div>
    );
};

export default AdminDashboard;
