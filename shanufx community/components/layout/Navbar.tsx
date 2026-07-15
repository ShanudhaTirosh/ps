'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useOnlineCount } from '@/lib/hooks/useChat';

interface Props {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: Props) {
  const { user, role, signOut, loading } = useAuth();
  const pathname = usePathname();
  const onlineCount = useOnlineCount();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="comm-navbar app-navbar">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link href="/" className="nav-brand">
          <div className="nav-logo-icon">S</div>
          <div>
            <div className="nav-logo-text">ShanuFx</div>
            <div className="nav-logo-sub">Community</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav-links">
          <NavLink href="/community" label="Forum" icon="fa-layer-group" active={isActive('/community')} />
          <NavLink href="/channels" label="Chat" icon="fa-comments" active={isActive('/channels')} />
          {user && <NavLink href="/dashboard" label="Dashboard" icon="fa-gauge" active={isActive('/dashboard')} />}
          {(role === 'primary' || role === 'admin') && (
            <NavLink href="/admin" label="Admin" icon="fa-shield" active={isActive('/admin')} />
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="nav-actions">
        {/* Online count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace" }}>
          <div className="nav-online-dot" />
          {onlineCount} online
        </div>

        {loading ? null : user ? (
          <div style={{ position: 'relative' }}>
            <button className="nav-user-btn" onClick={() => setMenuOpen(v => !v)}>
              <AvatarImg src={user.avatar} name={user.displayName} size={26} />
              <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username}
              </span>
              <i className={`fas fa-chevron-${menuOpen ? 'up' : 'down'}`} style={{ fontSize: '0.65rem', opacity: 0.5 }} />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)',
                background: 'rgba(10,8,25,0.98)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '0.5rem', minWidth: 160, zIndex: 100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                <DropItem href="/dashboard" icon="fa-gauge" label="Dashboard" onClick={() => setMenuOpen(false)} />
                <DropItem href="/dashboard?tab=settings" icon="fa-gear" label="Settings" onClick={() => setMenuOpen(false)} />
                {(role === 'primary' || role === 'admin') && (
                  <DropItem href="/admin" icon="fa-shield" label="Admin Panel" onClick={() => setMenuOpen(false)} />
                )}
                <div style={{ height: 1, background: 'var(--border)', margin: '0.4rem 0' }} />
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.6rem', borderRadius: 8, border: 'none', background: 'none', color: 'var(--danger)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <i className="fas fa-sign-out-alt" style={{ width: 16 }} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', borderRadius: 8 }} onClick={onLoginClick}>
            <i className="fas fa-sign-in-alt" /> Sign In
          </button>
        )}

        {/* Mobile menu btn */}
        <button
          className="mobile-ham"
          onClick={() => setMenuOpen(v => !v)}
          style={{ display: 'none', background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
        >
          <i className="fas fa-bars" />
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.82rem',
      fontWeight: 600, color: active ? 'var(--primary-light)' : 'var(--text-3)',
      background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      <i className={`fas ${icon}`} style={{ fontSize: '0.75rem' }} />
      {label}
    </Link>
  );
}

function DropItem({ href, icon, label, onClick }: { href: string; icon: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.6rem', borderRadius: 8, color: 'var(--text-2)', fontSize: '0.82rem', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <i className={`fas ${icon}`} style={{ width: 16, fontSize: '0.8rem' }} />
      {label}
    </Link>
  );
}

export function AvatarImg({ src, name, size = 36 }: { src: string; name: string; size?: number }) {
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  const initials = name?.charAt(0)?.toUpperCase() || '?';
  const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f472b6', '#f59e0b'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.38, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
