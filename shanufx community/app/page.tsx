'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import LoginModal from '@/components/auth/LoginModal';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spin" />
        <span className="loading-text">Loading ShanuFx Community…</span>
      </div>
    );
  }

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <main className="landing">
        <section className="landing-hero">
          <div className="landing-content">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="landing-badge">
                <div className="landing-live-dot" />
                Live Community Platform
              </div>

              <h1 className="landing-title">
                Build, Learn &amp;{' '}
                <span className="text-gradient">Connect</span>
                {' '}with Devs
              </h1>

              <p className="landing-desc">
                A community for developers who build real things. Discuss Android internals,
                share full-stack projects, get help, and connect with fellow builders from
                Sri Lanka and beyond.
              </p>

              <div className="landing-btns">
                {user ? (
                  <>
                    <button className="btn-primary" onClick={() => router.push('/community')}>
                      <i className="fas fa-layer-group" /> Browse Forum
                    </button>
                    <button className="btn-outline" onClick={() => router.push('/channels')}>
                      <i className="fas fa-comments" /> Open Chat
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-primary" onClick={() => setShowLogin(true)}>
                      <i className="fas fa-sign-in-alt" /> Join Community
                    </button>
                    <button className="btn-outline" onClick={() => router.push('/community')}>
                      <i className="fas fa-eye" /> Browse as Guest
                    </button>
                  </>
                )}
              </div>

              <div className="landing-features">
                <div className="landing-feat"><i className="fas fa-layer-group" /> Reddit-style Forum</div>
                <div className="landing-feat"><i className="fas fa-comments" /> Real-time Chat</div>
                <div className="landing-feat"><i className="fas fa-shield" /> Admin Controls</div>
                <div className="landing-feat"><i className="fas fa-link" /> Invite System</div>
              </div>
            </motion.div>
          </div>

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: -1 }}>
            {[600, 400, 250].map((size, i) => (
              <div key={i} style={{
                position: 'absolute', width: size, height: size,
                borderRadius: '50%', border: '1px solid rgba(124,58,237,0.08)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                animation: `spin ${12 + i * 4}s linear infinite${i % 2 === 1 ? ' reverse' : ''}`,
              }} />
            ))}
          </div>
        </section>

        {/* Feature cards */}
        <section style={{ padding: '0 1.5rem 5rem', maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}
          >
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="glass-card"
                style={{ padding: '1.5rem', borderRadius: 16, cursor: 'pointer' }}
                onClick={() => router.push(f.href)}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className={`fas ${f.icon}`} style={{ color: f.color, fontSize: '1.2rem' }} />
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

const FEATURES = [
  {
    title: 'Forum',
    icon: 'fa-layer-group',
    color: '#a855f7',
    bg: 'rgba(124,58,237,0.12)',
    desc: 'Reddit-style posts with upvotes, nested comments, flair tags, and channel filtering.',
    href: '/community',
  },
  {
    title: 'Real-time Chat',
    icon: 'fa-comments',
    color: '#22d3ee',
    bg: 'rgba(6,182,212,0.1)',
    desc: 'Discord-style channel chat powered by Firebase RTDB with typing indicators.',
    href: '/channels',
  },
  {
    title: 'Admin Panel',
    icon: 'fa-shield',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    desc: 'Full platform management: users, channels, posts, invite links, and site settings.',
    href: '/admin',
  },
  {
    title: 'Invite System',
    icon: 'fa-link',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.1)',
    desc: 'Generate time-limited invite links. Share with anyone — they join in one click.',
    href: '/join',
  },
];
