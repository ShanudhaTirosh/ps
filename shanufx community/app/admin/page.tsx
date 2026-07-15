'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import LoginModal from '@/components/auth/LoginModal';

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="app-shell">
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <Sidebar />
        <div className="app-content">
          <AdminDashboard />
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
