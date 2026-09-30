import React from 'react';
import { useNavigate } from 'react-router';
import { Compass, Home, LogIn, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0D0D0E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
                {/* Logo & Icon Badge */}
                <div className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
                    <span className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Compass className="w-5 h-5 text-purple-400 animate-pulse" />
                    </span>
                    <span className="tracking-tight text-xl font-bold">Nexus</span>
                </div>

                {/* Big 404 Display */}
                <div className="relative">
                    <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 select-none">
                        404
                    </h1>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                        Page Not Found
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
                        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="w-full sm:w-auto px-6 py-3.5 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-lg shadow-white/10 active:scale-[0.98]"
                    >
                        <Home className="w-4 h-4" />
                        Go to Home
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto px-6 py-3.5 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer border border-white/10 flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                    >
                        <LogIn className="w-4 h-4 text-purple-400" />
                        Sign In
                    </button>
                </div>

                {/* Back Link */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1 mt-4 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Go back to previous page
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
