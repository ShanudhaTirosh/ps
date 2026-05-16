'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export default function RightClickProtector({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Block right click
    const handleContextMenu = (e: MouseEvent) => {
      if (!user) e.preventDefault();
    };

    // Block DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (user) return; // Allow for authenticated users

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Inspect) or Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Console) or Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
      }
      // Ctrl+Shift+C (Inspect Element) or Cmd+Option+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
      }
      // Ctrl+U (View Source) or Cmd+U
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user]);

  return <>{children}</>;
}
