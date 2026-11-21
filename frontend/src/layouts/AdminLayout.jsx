import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

/**
 * AdminLayout — Role Guarded Admin & Moderation Panel Layout
 */
const AdminLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';

    if (!isAdminOrMod) {
        toast.error("Access Denied", {
            description: "Admin or Moderator privileges are required to view this area."
        });
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0F19] text-neutral-900 dark:text-neutral-100 font-sans antialiased flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            {/* Admin Header Navbar */}
            <header className="sticky top-0 z-50 h-14 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/80 dark:border-neutral-800 px-6 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />
                        </div>
                        <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            weeChat
                        </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider">
                        Admin Web
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {user?.name} ({user?.role})
                    </span>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                    >
                        Return to App →
                    </button>
                </div>
            </header>

            {/* Admin Main Content Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
