import React from 'react';
import { Outlet } from 'react-router';

/**
 * CallLayout — Fullscreen Video Call Layout (No Navbar, No Mobile Tab Bar)
 */
const CallLayout = () => {
    return (
        <div className="fixed inset-0 z-50 bg-neutral-900 text-white font-sans antialiased flex flex-col items-center justify-center p-0 selection:bg-white selection:text-black">
            <Outlet />
        </div>
    );
};

export default CallLayout;
