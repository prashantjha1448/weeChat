import React from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

const Home = () => {
    // Redux se logged-in user ka name fetch karein
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            
            {/* Top Light Navbar */}
            <Navbar />

            {/* Apple Light Style Main Hero Workspace */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto">
                
                {/* Subtle Subtitle */}
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-4 block">
                    Workspace Active
                </span>

                {/* Apple Light Style Bold Welcome Heading */}
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 mb-4 leading-tight">
                    Welcome back, <br />
                    <span className="text-neutral-500">{user?.name || 'User'}</span> 👋
                </h1>

                {/* Minimalist Description */}
                <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-normal">
                    Your account is authenticated. Select a conversation or search users to start messaging.
                </p>

            </main>

        </div>
    );
};

export default Home;