import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { adminLogin } from '../api/admin.api.js';
import { toast } from 'sonner';

/**
 * AdminLoginModal — Authenticate Administrator Directly in Standalone Admin Portal
 */
const AdminLoginModal = ({ isOpen, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await adminLogin(email, password);
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
                        <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
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
