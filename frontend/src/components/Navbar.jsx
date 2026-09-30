import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAuthentication } from '../hooks/auth.hooks';
import NotificationBell from './NotificationBell';
import { MessageSquare, Users } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const [menuOpen, setMenuOpen] = useState(false);
    const timeoutRef = useRef(null);
    const { onLogoutSubmit } = useAuthentication();
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMenuOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setMenuOpen(false);
        }, 150);
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 bg-[#F5F5F7]/90 backdrop-blur-md font-sans text-neutral-900 selection:bg-black selection:text-white">
            
            {/* Apple Light Minimalist Logo */}
            <div 
                onClick={() => navigate('/home')} 
                className="flex items-center gap-2 cursor-pointer group"
            >
                <img src="/weechat-logo.png" alt="weeChat Logo" className="w-6 h-6 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                    weeChat
                </span>
            </div>

            {/* Right Action Controls: Rooms, Messages, NotificationBell, User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Rooms Dashboard Button */}
                <button
                    type="button"
                    onClick={() => navigate('/home/rooms')}
                    aria-label="Custom Rooms"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-200/60 transition-colors cursor-pointer"
                    title="Custom Group Rooms (up to 100 people)"
                >
                    <Users className="w-4 h-4 text-neutral-800" />
                    <span className="hidden sm:inline">Rooms</span>
                </button>

                {/* Messages Icon Button */}
                <button
                    type="button"
                    onClick={() => navigate('/home/notifications')}
                    aria-label="Messages"
                    className="p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-200/50 transition-colors cursor-pointer"
                    title="Messages"
                >
                    <MessageSquare className="w-5 h-5 text-neutral-600 hover:text-black transition-colors" />
                </button>

                {/* Notifications Bell Dropdown */}
                <NotificationBell />

                {/* Profile Menu Wrapper */}
                <div 
                    className="relative py-2" 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                >
                {/* Trigger Button (Pure Text & Avatar, No Box) */}
                <button
                    className="flex items-center gap-2.5 px-2 py-1 bg-transparent group cursor-pointer"
                    aria-label="Profile menu"
                >
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center uppercase group-hover:bg-neutral-300 transition-all overflow-hidden border border-neutral-300">
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.name ? user.name.charAt(0) : 'U'
                        )}
                    </div>
                    <span className="text-xs font-medium text-neutral-600 group-hover:text-black transition-colors hidden sm:block">
                        {user?.name || 'Account'}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu (Seamless Pure Apple Text, Hover Open with 150ms delay) */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white p-3 z-50 flex flex-col gap-3 text-left animate-in fade-in duration-150 border border-neutral-200/80 rounded-2xl shadow-2xl">
                        
                        {/* 1. ACCOUNT Section */}
                        <div>
                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
                                Account
                            </p>
                            <p className="text-xs font-semibold text-neutral-900 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                @{user?.username || 'username'}
                            </p>
                        </div>

                        {/* 2. PROFILE & SETTINGS Section */}
                        <div className="flex flex-col gap-2 pt-1 border-t border-neutral-200/60">
                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
                                Profile & Settings
                            </p>
                            
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/home/profile');
                                }}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                View Profile
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/home/history');
                                }}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                Call History
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/home/settings');
                                }}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                Settings
                            </button>
                        </div>

                        {/* 3. SUPPORT Section */}
                        <div className="flex flex-col gap-2 pt-1 border-t border-neutral-200/60">
                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
                                Support
                            </p>
                            
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/home/settings/help');
                                }}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                Help & Support
                            </button>
                        </div>

                        {/* 4. ADMIN Section (Only if admin or moderator) */}
                        {(user?.role === 'admin' || user?.role === 'moderator') && (
                            <div className="flex flex-col gap-2 pt-1 border-t border-neutral-200/60">
                                <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
                                    Admin
                                </p>
                                
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate('/admin');
                                    }}
                                    className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                                >
                                    Admin Panel
                                </button>
                            </div>
                        )}

                        {/* 5. Sign Out (Red) */}
                        <div className="pt-1 border-t border-neutral-200/60">
                            <button
                                onClick={() => {
                                    onLogoutSubmit();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>

                    </div>
                )}
            </div>
            </div>
        </nav>
    );
};

export default Navbar;