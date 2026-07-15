'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';

/**
 * Empty component that just mounts the useNotifications hook 
 * to ensure invites are caught globally.
 */
export default function NotificationTracker() {
  useNotifications();
  return null;
}
