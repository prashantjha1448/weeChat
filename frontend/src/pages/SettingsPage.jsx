import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import SettingsLayout from '../features/settings/SettingsLayout';

const SettingsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Desktop auto-redirect index route to /home/settings/account
        if ((location.pathname === '/home/settings' || location.pathname === '/home/settings/') && window.innerWidth >= 768) {
            navigate('/home/settings/account', { replace: true });
        }
    }, [location.pathname, navigate]);

    return <SettingsLayout />;
};

export default SettingsPage;
