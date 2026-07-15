'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UserDashboard from '@/components/dashboard/UserDashboard';
import LoginModal from '@/components/auth/LoginModal';

function DashboardInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || undefined;
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="app-shell">
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <Sidebar />
        <div className="app-content">
          <UserDashboard tab={tab} />
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spin" /></div>}>
      <DashboardInner />
    </Suspense>
  );
}
