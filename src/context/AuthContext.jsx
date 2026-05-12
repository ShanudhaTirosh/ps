import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null); // 'primary' | 'admin' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Check role
        try {
          const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
          if (adminDoc.exists() && adminDoc.data().uid === firebaseUser.uid) {
            setRole('primary');
          } else {
            const grantedDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
            setRole(grantedDoc.exists() ? 'admin' : null);
          }
        } catch { setRole(null); }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    // First user becomes primary admin
    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) {
      await setDoc(adminRef, { uid: u.uid, email: u.email, name: u.displayName });
    }
    return result;
  };

  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
