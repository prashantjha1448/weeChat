import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router';
import { Shield, Sliders, Video, Lock, Bell, Palette, HelpCircle, ChevronRight } from 'lucide-react';

const SettingsLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const navItems = [
        { key: 'account', label: 'Account & Security', path: '/home/settings/account', desc: 'Password, sessions & credentials', icon: Shield },
        { key: 'preferences', label: 'Match Preferences', path: '/home/settings/preferences', desc: 'Gender, age range & location', icon: Sliders },
        { key: 'call', label: 'Call Settings', path: '/home/settings/call', desc: 'Camera, mic & live video preview', icon: Video },
        { key: 'privacy', label: 'Privacy & Safety', path: '/home/settings/privacy', desc: 'Visibility flags, blocked users & reports', icon: Lock },
        { key: 'notifications', label: 'Notifications', path: '/home/settings/notifications', desc: 'Email alerts & in-app updates', icon: Bell },
        { key: 'appearance', label: 'Appearance & Language', path: '/home/settings/appearance', desc: 'Theme mode & display language', icon: Palette },
        { key: 'help', label: 'Help & Legal', path: '/home/settings/help', desc: 'Support center, tickets & legal terms', icon: HelpCircle }
    ];

    // Check if route is exact index /home/settings or /home/settings/
    const isIndex = currentPath === '/home/settings' || currentPath === '/home/settings/';

    return (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 text-left selection:bg-black selection:text-white">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Desktop Sidebar Navigation */}
                <aside className="w-full md:w-64 lg:w-72 shrink-0 hidden md:block sticky top-24">
                    <nav className="bg-white border border-neutral-200/70 rounded-2xl p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = currentPath.startsWith(item.path);
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => navigate(item.path)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                                        isActive
                                            ? 'bg-neutral-200/60 text-[#1D1D1F] font-semibold'
                                            : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-neutral-100/60 font-normal'
                                    }`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                        isActive ? 'bg-[#1D1D1F] text-white' : 'bg-neutral-100 text-[#86868B]'
                                    }`}>
                                        <IconComponent className="w-3.5 h-3.5" />
                                    </div>

                                    <div className="flex flex-col min-w-0 pr-1">
                                        <span className="text-xs tracking-tight truncate">{item.label}</span>
                                        <span className="text-[10px] text-[#86868B] font-normal truncate mt-0.5">
                                            {item.desc}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Settings Content Area */}
                <main className="flex-1 w-full min-w-0">
                    {/* On mobile index view: show category list if at /home/settings */}
                    {isIndex ? (
                        <div className="w-full flex flex-col gap-5 md:hidden">
                            <div className="mb-1">
                                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Settings</h1>
                                <p className="text-sm text-[#86868B] mt-1 font-normal">Select a category to manage settings</p>
                            </div>

                            <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)] divide-y divide-neutral-100 overflow-hidden">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => navigate(item.path)}
                                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1D1D1F]">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-normal text-[#1D1D1F]">{item.label}</p>
                                                    <p className="text-xs text-[#86868B]">{item.desc}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    {/* Outlet for nested sub-routes */}
                    <div className={isIndex ? 'hidden md:block' : 'block'}>
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default SettingsLayout;
