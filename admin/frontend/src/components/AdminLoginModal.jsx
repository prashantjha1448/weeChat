import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import { adminLogin } from '../api/admin.api.js';
import { toast } from 'sonner';

/**
 * AdminLoginModal — Authenticate Administrator Directly in Standalone Admin Portal
 */
const AdminLoginModal = ({ isOpen, onLoginSuccess }) => {
    const [email, setEmail] = useState('admin@weechat.io');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await adminLogin(email.trim(), password);
            if (res && res.accessToken) {
                localStorage.setItem('admin_token', res.accessToken);
                localStorage.setItem('token', res.accessToken);
                toast.success(`Welcome Admin: ${res.user?.name || 'Administrator'}`);
                onLoginSuccess(res.user);
            }
        } catch (err) {
            console.error(err);
            toast.error("Admin Authentication Failed", {
                description: err.response?.data?.message || err.message || "Invalid admin credentials"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFill = (fillEmail) => {
        setEmail(fillEmail);
        setPassword('Admin@123456');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
            <div
                className="relative w-full max-w-sm bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-md">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold tracking-tight">weeChat Admin Web</h3>
                        <p className="text-[11px] text-neutral-500">Authorized Personnel Only</p>
                    </div>
                </div>

                {/* Quick Autofill Helper Buttons */}
                <div className="mb-4 p-2.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px]">
                    <span className="text-neutral-500 block mb-1.5 font-medium flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-purple-500" />
                        Quick Select Credentials:
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => handleQuickFill('admin@weechat.io')}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-[10px] shadow-2xs"
                        >
                            admin@weechat.io
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickFill('prashantjha1632@gmail.com')}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-[10px] shadow-2xs"
                        >
                            prashantjha1632
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    <div>
                        <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                            Admin Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@weechat.io"
                                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <span className="text-[10px] text-neutral-400 font-mono">
                                Password: <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">Admin@123456</code>
                            </span>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin@123456"
                                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 mt-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                    >
                        <span>{loading ? 'Authenticating...' : 'Sign in to Admin Dashboard'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </form>

                <p className="text-[10px] text-neutral-400 text-center mt-4">
                    Sessions are cryptographically verified with HS256 tokens & IP audits.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginModal;
