import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import MobileTabBar from '../components/MobileTabBar';

const AppLayout = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    // Scroll Listener for Dynamic Navbar Border & Shadow
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            
            {/* Sticky App Header Navbar */}
            <Navbar />

            {/* Main Content View Container */}
            <main className="flex-1 pb-20 md:pb-8">
                <Outlet />
            </main>

            {/* Mobile Bottom Tab Bar (visible below md) */}
            <MobileTabBar />

        </div>
    );
};

export default AppLayout;
