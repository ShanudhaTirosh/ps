'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, serverTimestamp, set, remove, query, limitToLast, orderByKey } from 'firebase/database';
import { rtdb } from '@/lib/firebase/config';
import type { ChatMessage } from '@/lib/types';

export function useChat(channelId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;
    const msgRef = query(
      ref(rtdb, `channels/${channelId}/messages`),
      orderByKey(),
      limitToLast(100)
    );

    const handler = onValue(msgRef, (snap) => {
      const msgs: ChatMessage[] = [];
      snap.forEach((child) => {
        msgs.push({ id: child.key!, ...child.val() });
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => off(msgRef, 'value', handler);
  }, [channelId]);

  const sendMessage = async (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const msgRef = ref(rtdb, `channels/${channelId}/messages`);
    
    // Strip nested undefined properties in replyTo to satisfy Firebase RTDB push validation
    let replyTo = undefined;
    if (msg.replyTo) {
      replyTo = Object.fromEntries(
        Object.entries(msg.replyTo).filter(([_, val]) => val !== undefined)
      );
    }

    // Strip top-level undefined properties
    const cleanMsg = Object.fromEntries(
      Object.entries(msg).filter(([key, val]) => val !== undefined && key !== 'replyTo')
    );

    await push(msgRef, {
      ...cleanMsg,
      ...(replyTo && { replyTo }),
      createdAt: Date.now()
    });
  };

  return { messages, loading, sendMessage };
}

export function useTyping(channelId: string, uid: string) {
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!channelId) return;
    const typingRef = ref(rtdb, `channels/${channelId}/typing`);
    const handler = onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      const filtered = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== uid)
      ) as Record<string, string>;
      setTypingUsers(filtered);
    });
    return () => off(typingRef, 'value', handler);
  }, [channelId, uid]);

  const setTyping = async (username: string) => {
    const myRef = ref(rtdb, `channels/${channelId}/typing/${uid}`);
    await set(myRef, username);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await remove(myRef);
    }, 3000);
  };

  const clearTyping = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const myRef = ref(rtdb, `channels/${channelId}/typing/${uid}`);
    await remove(myRef);
  };

  return { typingUsers, setTyping, clearTyping };
}

export function useOnlineCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const presRef = ref(rtdb, 'presence');
    const handler = onValue(presRef, (snap) => {
      let online = 0;
      snap.forEach((child) => {
        if (child.val()?.online) online++;
      });
      setCount(online);
    });
    return () => off(presRef, 'value', handler);
  }, []);

  return count;
}
