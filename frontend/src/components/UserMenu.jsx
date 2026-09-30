import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAuthentication } from '../hooks/auth.hooks';

const UserMenu = () => {
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const { onLogoutSubmit } = useAuthentication();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const menuRef = useRef(null);
    const itemRefs = useRef([]);

    const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';

    // List of menu items for keyboard navigation mapping
    const menuItems = [
        { label: 'Profile', path: '/home/profile' },
        { label: 'Call History', path: '/home/history' },
        { label: 'Settings', path: '/home/settings' },
        { label: 'Help & Support', path: '/home/settings/help' },
        ...(isAdminOrMod ? [{ label: 'Admin Panel', path: '/admin' }] : []),
        { label: 'Log out', action: onLogoutSubmit, isDanger: true }
    ];

    // Close on Outside Click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard Accessibility (Escape key & Arrow Keys)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = (prev + 1) % menuItems.length;
                    itemRefs.current[next]?.focus();
                    return next;
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = prev <= 0 ? menuItems.length - 1 : prev - 1;
                    itemRefs.current[next]?.focus();
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, menuItems.length]);

    const handleItemClick = (item) => {
        setIsOpen(false);
        setFocusedIndex(-1);
        if (item.action) {
            item.action();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <div className="relative py-2" ref={menuRef}>
            
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-transparent group cursor-pointer transition-colors hover:bg-neutral-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls="user-menu-dropdown"
                aria-label="User account menu"
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
                <svg
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Seamless Borderless Text Dropdown Menu (150ms fade + scale from 0.98) */}
            {isOpen && (
                <div
                    id="user-menu-dropdown"
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200/80 rounded-2xl p-2 z-50 flex flex-col gap-1 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all"
                >
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-neutral-200/80 mb-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center uppercase overflow-hidden">
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name ? user.name.charAt(0) : 'U'
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-neutral-900 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate">
                                {user?.email || `@${user?.username || 'username'}`}
                            </p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-0.5" role="none">
                        {menuItems.map((item, index) => {
                            if (item.label === 'Log out') {
                                return (
                                    <React.Fragment key={item.label}>
                                        <div className="border-t border-neutral-200/80 my-1" role="separator" />
                                        <button
                                            ref={(el) => (itemRefs.current[index] = el)}
                                            role="menuitem"
                                            tabIndex={isOpen ? 0 : -1}
                                            onClick={() => handleItemClick(item)}
                                            className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                                        >
                                            {item.label}
                                        </button>
                                    </React.Fragment>
                                );
                            }

                            return (
                                <button
                                    key={item.label}
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    role="menuitem"
                                    tabIndex={isOpen ? 0 : -1}
                                    onClick={() => handleItemClick(item)}
                                    className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                </div>
            )}
        </div>
    );
};

export default UserMenu;
