import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuthentication } from '../hooks/auth.hooks';

const ProtectedLayouts = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const { getCurrentUserStatus } = useAuthentication();

  useEffect(() => {
    const verifySession = async () => {
      await getCurrentUserStatus();
      setLoading(false);
    };
    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-neutral-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedLayouts;