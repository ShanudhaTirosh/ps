'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged, signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref, set, onDisconnect, serverTimestamp as rtdbTimestamp } from 'firebase/database';
import { auth, db, rtdb } from '@/lib/firebase/config';
import type { CommunityUser, UserRole } from '@/lib/types';

interface AuthCtx {
  firebaseUser: FirebaseUser | null;
  user: CommunityUser | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  firebaseUser: null, user: null, role: null, loading: true,
  signOut: async () => {}, refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<CommunityUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserDoc = async (fbUser: FirebaseUser) => {
    const docRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      // First sign-in — create user doc
      const newUser: CommunityUser = {
        uid: fbUser.uid,
        username: fbUser.displayName?.replace(/\s+/g, '').toLowerCase() || `user_${fbUser.uid.slice(0, 6)}`,
        displayName: fbUser.displayName || 'New Member',
        avatar: fbUser.photoURL || '',
        role: 'member',
        karma: 0,
        joinedAt: serverTimestamp(),
        postsCount: 0,
        commentsCount: 0,
        joinedChannels: [],
        isGuest: false,
      };
      await setDoc(docRef, newUser);
      setUser(newUser);
      setRole('member');
    } else {
      const data = snap.data() as CommunityUser;
      setUser(data);
      setRole(data.role);
    }
  };

  const setPresence = (fbUser: FirebaseUser, communityUser: CommunityUser | null) => {
    const presRef = ref(rtdb, `presence/${fbUser.uid}`);
    set(presRef, {
      username: communityUser?.username || fbUser.displayName || 'member',
      avatar: fbUser.photoURL || '',
      online: true,
      ts: rtdbTimestamp(),
    });
    onDisconnect(presRef).set({ online: false, ts: rtdbTimestamp() });
  };

  const refreshUser = async () => {
    if (firebaseUser) await loadUserDoc(firebaseUser);
  };

  useEffect(() => {
    let userUnsub: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        // Real-time user doc listener
        const docRef = doc(db, 'users', fbUser.uid);
        userUnsub = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as CommunityUser;
            setUser(data);
            setRole(data.role);
          } else {
            // First sign-in logic moved here
            const newUser: CommunityUser = {
              uid: fbUser.uid,
              username: fbUser.displayName?.replace(/\s+/g, '').toLowerCase() || `user_${fbUser.uid.slice(0, 6)}`,
              displayName: fbUser.displayName || 'New Member',
              avatar: fbUser.photoURL || '',
              role: 'member',
              karma: 0,
              joinedAt: serverTimestamp(),
              postsCount: 0,
              commentsCount: 0,
              joinedChannels: [],
              isGuest: false,
            };
            setDoc(docRef, newUser);
          }
          setLoading(false);
        });

        // Set presence
        const presRef = ref(rtdb, `presence/${fbUser.uid}`);
        set(presRef, {
          username: fbUser.displayName || 'member',
          avatar: fbUser.photoURL || '',
          online: true,
          ts: rtdbTimestamp(),
        });
        onDisconnect(presRef).set({ online: false, ts: rtdbTimestamp() });

      } else {
        if (userUnsub) userUnsub();
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (userUnsub) userUnsub();
    };
  }, []);

  const handleSignOut = async () => {
    if (firebaseUser) {
      const presRef = ref(rtdb, `presence/${firebaseUser.uid}`);
      await set(presRef, { online: false });
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, role, loading, signOut: handleSignOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
