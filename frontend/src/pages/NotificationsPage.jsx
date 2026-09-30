import React from 'react';
import { useNavigate } from 'react-router';

/**
 * NotificationsPage — Alerts View for /home/notifications
 */
const NotificationsPage = () => {
    const navigate = useNavigate();

    const notifications = [
        { id: 1, title: 'Welcome to Nexus platform', desc: 'Your account is active. Configure your match preferences to get started.', time: 'Today, 2:30 PM', read: true },
        { id: 2, title: 'Matching System Online', desc: 'Realtime WebSocket queueing is operational on port 3002.', time: 'Today, 1:15 PM', read: true },
        { id: 3, title: 'Security Verification Complete', desc: 'Session verified with SSL encrypted WebRTC signaling.', time: 'Yesterday', read: true }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-16">
            
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer mb-6"
            >
                <span>←</span>
                <span>Back</span>
            </button>

            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Notifications & Alerts</h1>
                <p className="text-xs text-neutral-500 mt-1">System updates, session alerts, and account activity</p>
            </div>

            <div className="w-full bg-white border border-neutral-200/90 rounded-3xl p-8 shadow-2xl shadow-neutral-200/80 text-left">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900">All System Alerts</h2>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                        {notifications.length} Alerts
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col gap-1.5 transition-all hover:bg-white hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-neutral-900">{n.title}</h4>
                                <span className="text-[11px] text-neutral-400 font-medium">{n.time}</span>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed font-normal">{n.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default NotificationsPage;
