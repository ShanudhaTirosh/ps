'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="text-center">
          <div className="admin-spinner" />
          <p className="auth-verifying">Verifying auth...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!role) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-denied-icon">🚫</div>
          <h2 className="auth-denied-title">Access Denied</h2>
          <p className="auth-denied-desc">This account is not authorized. Contact the primary admin.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
