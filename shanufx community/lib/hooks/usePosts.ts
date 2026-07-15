'use client';

import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, limit,
  onSnapshot, addDoc, deleteDoc, serverTimestamp,
  doc, updateDoc, increment, getDoc,
  where, getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Post, Comment } from '@/lib/types';

export function usePosts(channelId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(40)
    );
    if (channelId) {
      q = query(
        collection(db, 'posts'),
        where('channelId', '==', channelId),
        orderBy('createdAt', 'desc'),
        limit(40)
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
      setLoading(false);
    });
    return unsub;
  }, [channelId]);

  return { posts, loading };
}

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    const postUnsub = onSnapshot(doc(db, 'posts', postId), (snap) => {
      if (snap.exists()) setPost({ id: snap.id, ...snap.data() } as Post);
      setLoading(false);
    });

    const commQ = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    const commUnsub = onSnapshot(commQ, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
    });

    return () => { postUnsub(); commUnsub(); };
  }, [postId]);

  return { post, comments, loading };
}

export async function createPost(
  data: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'>
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, 'posts'), {
      ...data,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'users', data.authorUid), { postsCount: increment(1) });
    return ref.id;
  } catch (err) {
    console.error('Error in createPost hook:', err);
    throw err;
  }
}

export async function createComment(
  data: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>
): Promise<void> {
  await addDoc(collection(db, 'comments'), {
    ...data,
    upvotes: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', data.postId), { commentCount: increment(1) });
  await updateDoc(doc(db, 'users', data.authorUid), { commentsCount: increment(1) });
}

export async function votePost(
  postId: string, 
  uid: string, 
  direction: 'up' | 'down',
  authorUid: string
): Promise<void> {
  const voteId = `${postId}_${uid}`;
  const voteRef = doc(db, 'postVotes', voteId);
  const postRef = doc(db, 'posts', postId);
  const authorRef = doc(db, 'users', authorUid);
  const voteSnap = await getDoc(voteRef);

  if (voteSnap.exists()) {
    const data = voteSnap.data();
    const existing = data.direction as string;
    
    if (existing === direction) {
      // Undo vote
      await updateDoc(voteRef, { direction: null });
      await updateDoc(postRef, { [direction === 'up' ? 'upvotes' : 'downvotes']: increment(-1) });
      await updateDoc(authorRef, { karma: increment(direction === 'up' ? -1 : 1) });
      return;
    }
    
    // Switch vote
    const prev = direction === 'up' ? 'downvotes' : 'upvotes';
    await updateDoc(voteRef, { direction });
    await updateDoc(postRef, { [prev]: increment(-1), [direction === 'up' ? 'upvotes' : 'downvotes']: increment(1) });
    await updateDoc(authorRef, { karma: increment(direction === 'up' ? 2 : -2) });
  } else {
    // New vote
    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(voteRef, { uid, postId, direction })
    );
    await updateDoc(postRef, { [direction === 'up' ? 'upvotes' : 'downvotes']: increment(1) });
    await updateDoc(authorRef, { karma: increment(direction === 'up' ? 1 : -1) });
  }
}

export async function savePost(uid: string, postId: string, isSaving: boolean): Promise<void> {
  const { arrayUnion, arrayRemove } = await import('firebase/firestore');
  await updateDoc(doc(db, 'users', uid), {
    savedPosts: isSaving ? arrayUnion(postId) : arrayRemove(postId)
  });
}

export async function reportPost(postId: string): Promise<void> {
  await updateDoc(doc(db, 'posts', postId), {
    reportCount: increment(1)
  });
}

export async function deletePost(postId: string, authorUid: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', postId));
  await updateDoc(doc(db, 'users', authorUid), {
    postsCount: increment(-1)
  });
}

export async function deleteComment(commentId: string, postId: string, authorUid: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId));
  await updateDoc(doc(db, 'posts', postId), { commentCount: increment(-1) });
  await updateDoc(doc(db, 'users', authorUid), { commentsCount: increment(-1) });
}

export async function getUserVote(postId: string, uid: string): Promise<'up' | 'down' | null> {
  const snap = await getDoc(doc(db, 'postVotes', `${postId}_${uid}`));
  if (!snap.exists()) return null;
  return snap.data().direction || null;
}

export function useChannels() {
  const [channels, setChannels] = useState<import('@/lib/types').Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'channels'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      setChannels(snap.docs.map(d => ({ id: d.id, ...d.data() } as import('@/lib/types').Channel)));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { channels, loading };
}

export async function getAllUsers(): Promise<import('@/lib/types').CommunityUser[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ ...d.data() } as import('@/lib/types').CommunityUser));
}

export async function createChannel(
  data: Omit<import('@/lib/types').Channel, 'id' | 'createdAt' | 'memberCount'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'channels'), {
    ...data,
    memberCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function sendInvite(
  fromUser: import('@/lib/types').CommunityUser,
  toUid: string,
  channel: import('@/lib/types').Channel
): Promise<void> {
  await addDoc(collection(db, 'notifications'), {
    toUid,
    fromUid: fromUser.uid,
    fromName: fromUser.username,
    type: 'invite',
    data: {
      channelId: channel.id,
      channelName: channel.displayName || channel.name,
      type: channel.type,
    },
    isRead: false,
    createdAt: serverTimestamp(),
  });
}
export async function updateProfile(uid: string, data: Partial<import('@/lib/types').CommunityUser>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data);
}

export function useUserProfile(username: string) {
  const [user, setUser] = useState<import('@/lib/types').CommunityUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setUser({ ...snap.docs[0].data() } as import('@/lib/types').CommunityUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [username]);

  return { user, loading };
}

export async function banUser(uid: string, until: unknown | null): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    isBanned: until !== null,
    bannedUntil: until
  });
}
