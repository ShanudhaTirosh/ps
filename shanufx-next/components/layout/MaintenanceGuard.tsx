'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaintenanceGuard({ children }: { children: ReactNode }) {
  const { role, loading: authLoading } = useAuth();
  const [maintenance, setMaintenance] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Listen to siteSettings/notifications document for real-time maintenance toggle
    const settingsRef = doc(db, 'siteSettings', 'notifications');
    const unsub = onSnapshot(
      settingsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setMaintenance(!!docSnap.data().maintenance);
        } else {
          setMaintenance(false);
        }
        setLoadingSettings(false);
      },
      (error) => {
        console.error('Failed to fetch site settings:', error);
        setLoadingSettings(false);
      }
    );

    return unsub;
  }, []);

  const isAdminPath = pathname ? pathname.startsWith('/admin') : false;
  const isBypassed = isAdminPath || role === 'primary' || role === 'admin';

  // Render a loading state while checking settings and authentication
  if ((loadingSettings || authLoading) && !isAdminPath) {
    return (
      <div className="auth-screen">
        <div className="text-center">
          <div className="admin-spinner" />
          <p className="auth-verifying">Loading platform settings...</p>
        </div>
      </div>
    );
  }

  // If maintenance mode is active and user is not authorized or on admin path, show maintenance screen
  if (maintenance && !isBypassed) {
    return (
      <div className="auth-screen">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="auth-card glass-card text-center"
            style={{ maxWidth: '500px', border: '1px solid rgba(124, 58, 237, 0.2)' }}
          >
            <div className="card-glow" />
            
            {/* Animated Construction Icon */}
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                  color: 'var(--primary-light)',
                  textShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
                }}
              >
                <i className="fas fa-cog" />
              </motion.div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--cyan)',
                  marginTop: '10px',
                }}
              >
                <i className="fas fa-wrench" />
              </div>
            </div>

            <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>
              Systems Offline
            </span>

            <h1 className="section-title-md" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              Under <span className="text-gradient">Maintenance</span>
            </h1>

            <p className="section-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2rem' }}>
              We are currently upgrading server systems and deploying optimizations. SHANUTECHX will be online shortly. Thank you for your patience!
            </p>

            {/* Quick Contact Options */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <a
                href="mailto:info.shanudhatirosh@gmail.com"
                className="footer-social-link"
                title="Email"
                style={{ width: '45px', height: '45px', borderRadius: '12px' }}
              >
                <i className="fas fa-envelope" />
              </a>
              <a
                href="https://github.com/ShanudhaTirosh"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                title="GitHub"
                style={{ width: '45px', height: '45px', borderRadius: '12px' }}
              >
                <i className="fab fa-github" />
              </a>
              <a
                href="https://x.com/ShanuFx"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                title="Twitter"
                style={{ width: '45px', height: '45px', borderRadius: '12px' }}
              >
                <i className="fab fa-twitter" />
              </a>
            </div>

            {/* Admin Bypass Link */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <a
                href="/admin"
                className="auth-back"
                style={{ fontSize: '0.8rem', color: 'var(--text-3)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              >
                <i className="fas fa-lock" /> Administrative Portal Login
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return <>{children}</>;
}
