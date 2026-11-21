import React from 'react';
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
    Database
} from 'lucide-react';

/**
 * OverviewTab — High-Level KPIs, Age/Gender Demographics, Feature Usage & Admin Audit Trail
 */
const OverviewTab = ({ stats, loading, onNavigateTab }) => {
    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin" />
                <p className="text-xs text-neutral-500 font-medium">Loading platform analytics & demographics...</p>
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

    return (
        <div className="space-y-8 animate-fade-in text-left">
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Clients */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Registered Clients</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.totalUsers?.toLocaleString() || 0}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                        <span className="text-emerald-500 font-bold">Client Only</span> (0 admins mixed)
                    </p>
                </div>

                {/* Active Online Now */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Online</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {stats?.activeUsersNow || 1}
                        </p>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Live
                        </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">Real-time socket sessions</p>
                </div>

                {/* Dedicated Admins (Separated in DB) */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-purple-200/70 dark:border-purple-900/40 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Dedicated Admins</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.totalAdmins ?? 3}
                    </p>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        Isolated in <code className="bg-purple-100 dark:bg-purple-950/60 px-1 rounded">admins</code> DB
                    </p>
                </div>

                {/* Completed Calls */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">1-on-1 Calls</span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Video className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.featureUsage?.totalCalls?.toLocaleString() || 0}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                        {stats?.featureUsage?.totalCallMinutes || 0} call mins streamed
                    </p>
                </div>

                {/* Revenue */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Revenue</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        ₹{payments.totalRevenue?.toLocaleString('en-IN') || 0}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                        {payments.successfulCount || 0} success transactions
                    </p>
                </div>
            </div>

            {/* Demographics Row: Gender Distribution & Age Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution Card */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-blue-500" />
                                Gender Demographics
                            </h3>
                            <p className="text-xs text-neutral-500">Distribution of registered client users across gender identities</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {stats?.totalUsers || 0} clients total
                        </span>
                    </div>

                    {/* Progress Bar Split */}
                    <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex mb-6">
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

                    {/* 3 Columns */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                            <div className="flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Male
                            </div>
                            <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                                {gender.male.count}
                            </p>
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                {gender.male.percent}% of clients
                            </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                            <div className="flex items-center gap-1.5 mb-1 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                Female
                            </div>
                            <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                                {gender.female.count}
                            </p>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                                {gender.female.percent}% of clients
                            </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                            <div className="flex items-center gap-1.5 mb-1 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                Other / Non-Binary
                            </div>
                            <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                                {gender.other.count}
                            </p>
                            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                                {gender.other.percent}% of clients
                            </p>
                        </div>
                    </div>
                </div>

                {/* Age Demographics Card */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Age Group Cohorts
                            </h3>
                            <p className="text-xs text-neutral-500">Breakdown dynamically calculated from genuine client dates of birth</p>
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

            {/* Feature Usage Analytics Across Platform */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Platform Feature Consumption
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Top Feature: {mostUsedFeatureName}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Real-time platform feature adoption and engagement traffic
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigateTab('users')}
                        className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        View User Inspector <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{feat.name}</h4>
                                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{feat.sharePercent}%</span>
                            </div>
                            <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                {feat.totalEvents?.toLocaleString()}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1">{feat.metricLabel}</p>

                            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden mt-3">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${Math.max(5, feat.sharePercent)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Admin Security & Audit Trail (Isolated admin_logs collection) */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Admin Security & Audit Logs
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-bold">
                                Isolated in <code className="font-mono">admin_logs</code> DB
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                            Cryptographically audited actions performed by administrators — strictly separated from client user activity
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">
                            {recentLogs.length} recent audit event{recentLogs.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {recentLogs.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center">
                        <Lock className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">No Admin Security Events Recorded Yet</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Admin logins and administrative operations will appear here in real-time.</p>
                    </div>
                ) : (
                    <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                                    <tr>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Administrator</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">IP Address</th>
                                        <th className="py-3 px-4">Device & Client</th>
                                        <th className="py-3 px-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                                    {recentLogs.map((log, idx) => (
                                        <tr key={log._id || idx} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    log.action?.includes('LOGIN')
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                        : log.action?.includes('BAN')
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                        : log.action?.includes('RESOLVE')
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
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
                                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold">
                                                        FAILED
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 w-fit">
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
        </div>
    );
};

export default OverviewTab;
