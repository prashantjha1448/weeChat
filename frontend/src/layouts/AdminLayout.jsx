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
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            
            {/* Admin Header Navbar */}
            <header className="sticky top-0 z-50 h-14 backdrop-blur-xl bg-white/90 border-b border-neutral-200/80 px-6 flex items-center justify-between shadow-sm">
                
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-neutral-900">
                            Nexus
                        </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                        Admin Panel
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-600">
                        {user?.name} ({user?.role})
                    </span>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
                    >
                        Return to App →
                    </button>
                </div>

            </header>

            {/* Admin Main Content Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>

        </div>
    );
};

export default AdminLayout;
