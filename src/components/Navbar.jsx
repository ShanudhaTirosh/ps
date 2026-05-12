import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobile(false); }, [location]);

  const navLinks = [
    { label: 'Home',       href: '/#home' },
    { label: 'About',      href: '/#about' },
    { label: 'Innovations',href: '/#innovations' },
    { label: 'Showcase',   href: '/showcase' },
    { label: 'Contact',    href: '/#contact' },
  ];

  return (
    <>
      {/* Scroll progress */}
      <motion.div 
        id="scroll-progress" 
        style={{ width: `${scrollPct}%`, position: 'fixed', top: 0, left: 0, height: '3px', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', zIndex: 101 }} 
      />

      {/* Main nav */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0.75rem 1.5rem',
        background: scrolled ? 'rgba(4,4,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.35s ease',
      }}>
        <nav style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#fff', fontSize: '1rem',
            }}>S</div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#f1f0f7', letterSpacing: '-0.02em' }}>
              ShanuFx
            </span>
          </Link>

          {/* Desktop links */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', listStyle: 'none', margin: 0, padding: 0 }}
              className="desktop-nav">
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className="nav-link">{l.label}</a>
              </li>
            ))}
            <li>
              <a href="/#contact" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}>
                Let's Talk
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button onClick={() => setMobile(o => !o)} className="mobile-menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
            aria-label="Menu">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav-overlay open"
          >
            <button onClick={() => setMobile(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.75rem', cursor: 'pointer' }}>
              ✕
            </button>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="mobile-nav-link" onClick={() => setMobile(false)}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
