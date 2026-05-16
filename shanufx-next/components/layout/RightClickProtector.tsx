'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export default function RightClickProtector({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!user) e.preventDefault();
    };
    window.addEventListener('contextmenu', handler);
    return () => window.removeEventListener('contextmenu', handler);
  }, [user]);

  return <>{children}</>;
}
