import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAuthentication } from '../hooks/auth.hooks';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const timeoutRef = useRef(null);
    const { onLogoutSubmit } = useAuthentication();

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
            <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded-full bg-black group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                    Nexus
                </span>
            </div>

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
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center uppercase group-hover:bg-neutral-300 transition-all">
                        {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-medium text-neutral-600 group-hover:text-black transition-colors hidden sm:block">
                        {user?.name || 'Account'}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu (Seamless Pure Apple Text, No Box Container, No Borders, No Shadows) */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#F5F5F7] p-2 z-50 flex flex-col gap-3 text-left animate-in fade-in duration-150">
                        
                        {/* Section Header */}
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

                        {/* Navigation Links */}
                        <div className="flex flex-col gap-2 pt-1">
                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
                                Profile & Settings
                            </p>
                            
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                View Profile
                            </button>

                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-left text-xs font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
                            >
                                Settings
                            </button>

                            <button
                                onClick={() => {
                                    onLogoutSubmit();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer pt-1"
                            >
                                Sign Out
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;