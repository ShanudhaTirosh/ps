'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

function JoinInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const { user, loading } = useAuth();

  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid' | 'expired' | 'used' | 'done'>('checking');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    checkToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (user && status === 'valid') claimToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  const checkToken = async () => {
    try {
      const snap = await getDoc(doc(db, 'inviteTokens', token));
      if (!snap.exists()) { setStatus('invalid'); return; }
      const data = snap.data();
      if (data.isUsed) { setStatus('used'); return; }
      if (data.expiresAt < Date.now()) { setStatus('expired'); return; }
      setStatus('valid');
    } catch { setStatus('invalid'); }
  };

  const claimToken = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'inviteTokens', token), { isUsed: true, usedBy: user.uid });
      setStatus('done');
      setTimeout(() => router.push('/community'), 1800);
    } catch { setStatus('invalid'); }
  };

  if (loading || status === 'checking') {
    return (
      <div className="loading-screen">
        <div className="loading-spin" />
        <span className="loading-text">Verifying invite…</span>
      </div>
    );
  }

  return (
    <div className="join-page">
      <div className="join-card">
        {status === 'valid' && !user && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", marginBottom: '0.5rem' }}>You&apos;re invited!</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Sign in or create an account to join the ShanuFx Community.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowLogin(true)}>
              <i className="fas fa-sign-in-alt" /> Sign In to Join
            </button>
          </div>
        )}

        {status === 'done' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", color: 'var(--green)', marginBottom: '0.5rem' }}>Welcome!</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.88rem' }}>
              You&apos;ve successfully joined ShanuFx Community. Redirecting…
            </p>
          </div>
        )}

        {(status === 'invalid' || status === 'expired' || status === 'used') && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {status === 'used' ? '🔒' : '❌'}
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", color: 'var(--danger)', marginBottom: '0.5rem' }}>
              {status === 'used' ? 'Link Already Used' : status === 'expired' ? 'Link Expired' : 'Invalid Link'}
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              {status === 'used' ? 'This invite link has already been used.'
                : status === 'expired' ? 'This invite link has expired. Ask an admin for a new one.'
                : 'This invite link is invalid or does not exist.'}
            </p>
            <button className="btn-outline" style={{ borderRadius: 10 }} onClick={() => router.push('/')}>
              Go to Homepage
            </button>
          </div>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spin" /></div>}>
      <JoinInner />
    </Suspense>
  );
}
