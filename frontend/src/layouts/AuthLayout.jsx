import React from 'react';
import { Outlet, useNavigate } from 'react-router';

/**
 * AuthLayout — Minimalist Authentication Layout (Logo only top bar)
 */
const AuthLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            
            {/* Header with Logo Only */}
            <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-neutral-200/40 bg-[#F5F5F7]/80 backdrop-blur-xl sticky top-0 z-50">
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-full px-1"
                    tabIndex={0}
                    role="button"
                    aria-label="weeChat home"
                >
                    <div className="w-5 h-5 rounded-full bg-black group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-base font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                        weeChat
                    </span>
                </div>
            </header>

            {/* Auth Page Content */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
                <Outlet />
            </main>

        </div>
    );
};

export default AuthLayout;
