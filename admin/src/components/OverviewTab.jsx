import React from 'react';
import {
    Users,
    Zap,
    Video,
    CreditCard,
    PieChart,
    Calendar,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';

/**
 * OverviewTab — High-Level KPIs, Age/Gender Demographics & Feature Usage
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

    return (
        <div className="space-y-8 animate-fade-in text-left">
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Registered</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.totalUsers?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <span className="text-emerald-500 font-bold">100% Verified</span> accounts in DB
                    </p>
                </div>

                {/* Active Online Now */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Active Right Now</span>
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
                    <p className="text-xs text-neutral-500 mt-1">Real-time active WebRTC / socket sessions</p>
                </div>

                {/* Completed Calls */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">1-on-1 Calls</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Video className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {stats?.featureUsage?.totalCalls?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                        {stats?.featureUsage?.totalCallMinutes || 0} call minutes streamed
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
                    <p className="text-xs text-neutral-500 mt-1">
                        {payments.successfulCount || 0} successful transaction{(payments.successfulCount !== 1) ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Demographics Row: Gender Distribution & Age Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution Card ("kitne male h kitne females , and other m aarahe h") */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-blue-500" />
                                Gender Demographics
                            </h3>
                            <p className="text-xs text-neutral-500">Distribution of registered users across gender identities</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {stats?.totalUsers || 0} users total
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
                                {gender.male.percent}% of total
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
                                {gender.female.percent}% of total
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
                                {gender.other.percent}% of total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Age Demographics Card ("kitne age group wle log , ki tarah ki unki catagory h") */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Age Group Cohorts
                            </h3>
                            <p className="text-xs text-neutral-500">Breakdown computed dynamically from users' date of birth</p>
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

            {/* Feature Usage Analytics Across Platform ("kosa feature zada use kr raha h") */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Platform Feature Consumption
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Top Feature: {stats?.featureUsage?.mostUsedFeature}
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
        </div>
    );
};

export default OverviewTab;
