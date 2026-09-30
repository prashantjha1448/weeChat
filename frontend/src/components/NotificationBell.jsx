import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

const NotificationBell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Mock initial notification count
    const [unreadCount, setUnreadCount] = useState(2);

    const mockNotifications = [
        { id: 1, title: 'Welcome to Nexus', desc: 'Start matching with peers in instant HD video calls.', time: '2m ago' },
        { id: 2, title: 'Match Algorithm Active', desc: 'Filter preferences ready for real-time queueing.', time: '1h ago' }
    ];

    // Close on Outside Click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape Key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen && e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <div className="relative py-2" ref={dropdownRef}>
            
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    setUnreadCount(0);
                }}
                aria-label="Notifications"
                aria-haspopup="true"
                aria-expanded={isOpen}
                className="relative p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-200/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Unread Badge Indicator */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black animate-pulse" />
                )}
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#F5F5F7] border border-neutral-200/80 rounded-2xl p-3 z-50 flex flex-col gap-2 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80 px-1">
                        <span className="text-xs font-bold text-neutral-900">Notifications</span>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">Alerts</span>
                    </div>

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {mockNotifications.map((n) => (
                            <div key={n.id} className="p-2.5 bg-white rounded-xl border border-neutral-200/60 shadow-sm text-left">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="text-xs font-bold text-neutral-900">{n.title}</h4>
                                    <span className="text-[10px] text-neutral-400">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-neutral-600 leading-snug">{n.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/home/notifications');
                        }}
                        className="w-full text-center py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer border-t border-neutral-200/80 mt-1"
                    >
                        View All Notifications →
                    </button>

                </div>
            )}

        </div>
    );
};

export default NotificationBell;
