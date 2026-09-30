import React from 'react';
import { useSelector } from 'react-redux';

/**
 * AdminPage — Admin & Moderation Panel Dashboard Placeholder
 */
const AdminPage = () => {
    const { user } = useSelector((state) => state.auth);

    const stats = [
        { label: 'Active Socket Connections', value: '42' },
        { label: 'Pending Abuse Reports', value: '3' },
        { label: 'Total Registered Users', value: '1,280' }
    ];

    return (
        <div className="w-full text-left">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Admin Dashboard</h1>
                <p className="text-xs text-neutral-500 mt-1">Platform moderation, metrics, and configuration management</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((s, idx) => (
                    <div key={idx} className="p-6 bg-white border border-neutral-200/90 rounded-3xl shadow-xl shadow-neutral-200/60">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">{s.label}</p>
                        <p className="text-3xl font-bold text-neutral-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Controls Placeholder */}
            <div className="p-8 bg-white border border-neutral-200/90 rounded-3xl shadow-2xl shadow-neutral-200/80">
                <h2 className="text-lg font-bold text-neutral-900 mb-2">Moderation Queue & Controls</h2>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    Logged in as <span className="font-bold">{user?.name}</span> ({user?.role}). Moderation tools, report review queues, and system configuration options are active for your account.
                </p>
            </div>
        </div>
    );
};

export default AdminPage;
