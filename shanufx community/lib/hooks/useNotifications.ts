'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { Notification } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function useNotifications() {
  const { user } = useAuth();
  const { notify, confirm } = useUI();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('toUid', '==', user.uid),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const newNotifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
      
      // Filter for new invites to show popup
      newNotifs.forEach(notif => {
        if (notif.type === 'invite' && !notifications.find(n => n.id === notif.id)) {
          confirm({
            title: 'New Invitation!',
            message: `${notif.fromName} invited you to join ${notif.data.channelName}`,
            confirmText: 'Join Now',
            cancelText: 'Maybe Later',
            onConfirm: async () => {
              // Mark as read/deleted
              await deleteDoc(doc(db, 'notifications', notif.id));
              router.push(`/channels?ch=${notif.data.channelId}`);
            },
            onCancel: async () => {
              await updateDoc(doc(db, 'notifications', notif.id), { isRead: true });
            }
          });
        }
      });

      setNotifications(newNotifs);
    }, (err) => {
      console.error('Notification listener error:', err);
    });

    return unsub;
  }, [user?.uid, notifications, confirm, router]);

  return { notifications };
}
