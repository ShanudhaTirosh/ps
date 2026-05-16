'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  label: string;
  type: 'hash' | 'route';
  sectionId?: string;
  to?: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let observer: IntersectionObserver | undefined;
    if (pathname === '/') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { threshold: 0.2, rootMargin: "-20% 0px -20% 0px" });

      ['home', 'about', 'skills', 'experience', 'services', 'testimonials', 'innovations', 'contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) observer!.observe(el);
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  const handleHashClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobile(false);
    const scrollTo = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (pathname === '/') {
      scrollTo();
    } else {
      router.push('/');
      setTimeout(scrollTo, 150);
    }
  };

  const navLinks: NavLink[] = [
    { label: 'Home',        type: 'hash',  sectionId: 'home' },
    { label: 'About',       type: 'hash',  sectionId: 'about' },
    { label: 'Innovations', type: 'hash',  sectionId: 'innovations' },
    { label: 'Showcase',    type: 'route', to: '/showcase' },
    { label: 'Feedback',    type: 'route', to: '/testimonials' },
    { label: 'Contact',     type: 'hash',  sectionId: 'contact' },
  ];

  const renderLink = (l: NavLink, extraClass = 'nav-link') => {
    let isActive = false;
    if (l.type === 'route') {
      isActive = pathname === l.to;
    } else if (pathname === '/') {
      const sectionMap: Record<string, string> = {
        'home': 'home',
        'about': 'about',
        'skills': 'about',
        'experience': 'about',
        'services': 'about',
        'testimonials': 'about',
        'innovations': 'innovations',
        'contact': 'contact'
      };
      isActive = sectionMap[activeSection] === l.sectionId;
    }

    const className = `${extraClass} ${isActive ? 'active' : ''}`;

    if (l.type === 'hash') {
      return (
        <a
          key={l.label}
          href={`#${l.sectionId}`}
          className={className}
          onClick={(e) => handleHashClick(e, l.sectionId!)}
        >
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.label} href={l.to!} className={className} onClick={() => setMobile(false)}>
        {l.label}
      </Link>
    );
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          width: `${scrollPct}%`,
          position: 'fixed', top: 0, left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          zIndex: 102,
          transformOrigin: 'left',
        }}
      />

      {/* Main nav */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0.75rem 1.5rem',
          background: scrolled ? 'rgba(4,4,10,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.35s ease',
        }}
      >
        <nav className="nav-container">
          {/* Logo */}
          <Link
            href="/"
            className="nav-brand"
            onClick={() => setMobile(false)}
          >
            <div className="nav-logo-icon">S</div>
            <span className="nav-logo-text">
              ShanuFx
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="desktop-nav desktop-nav-list">
            {navLinks.map(l => (
              <li key={l.label}>{renderLink(l)}</li>
            ))}
            <li>
              <a
                href="#contact"
                className="btn-primary nav-cta-btn"
                onClick={(e) => handleHashClick(e, 'contact')}
              >
                Let&apos;s Talk
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setMobile(o => !o)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            {...{ 'aria-expanded': mobileOpen ? 'true' : 'false', 'aria-controls': 'mobile-nav' }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-nav-overlay"
          >
            <button onClick={() => setMobile(false)} className="mobile-close-btn" aria-label="Close menu">
              ✕
            </button>
            <div className="mobile-nav-links">
              {navLinks.map(l => renderLink(l, 'mobile-nav-link'))}
              <a
                href="#contact"
                className="btn-primary mobile-cta"
                onClick={(e) => handleHashClick(e, 'contact')}
              >
                Let&apos;s Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Navigation Buttons */}
      <div className="nav-scroll-btns">
        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="scroll-top-btn"
              aria-label="Scroll to Top"
              title="Scroll to Top"
            >
              <i className="fas fa-chevron-up" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scrollPct < 95 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20 }}
              whileHover={{ y: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
              className="scroll-bottom-btn"
              aria-label="Scroll to Bottom"
              title="Scroll to Bottom"
            >
              <i className="fas fa-chevron-down" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .mobile-menu-btn {
          display: none;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.35rem 0.7rem;
          transition: all 0.2s;
        }
        .mobile-menu-btn:hover {
          border-color: rgba(124,58,237,0.5);
          color: #f1f0f7;
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
        }
        .nav-brand {
          display: flex; align-items: center; gap: 0.6rem; text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; color: #fff; font-size: 1rem;
        }
        .nav-logo-text {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: #f1f0f7; letter-spacing: -0.02em;
        }
        .desktop-nav-list {
          display: flex; align-items: center; gap: 1.75rem; list-style: none; margin: 0; padding: 0;
        }
        .scroll-top-btn {
          width: 45px; height: 45px; border-radius: 12px;
          background: rgba(124, 58, 237, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #fff; font-size: 1.2rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .scroll-bottom-btn {
          width: 45px; height: 45px; border-radius: 12px;
          background: rgba(6, 182, 212, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(6, 182, 212, 0.25);
          color: #fff; font-size: 1.2rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .nav-link {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: #f1f0f7; }
        .nav-link.active { color: #f1f0f7; position: relative; }
        .nav-link.active::after {
          content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, #7c3aed, #06b6d4); border-radius: 2px;
        }
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(4, 4, 10, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .mobile-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.3rem 0.7rem;
          transition: all 0.2s;
        }
        .mobile-close-btn:hover { color: #f1f0f7; border-color: rgba(124,58,237,0.5); }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }
        .mobile-nav-link {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: -0.02em;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #f1f0f7; }
        .mobile-nav-link.active {
          background: linear-gradient(90deg, #7c3aed, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mobile-cta {
          margin-top: 0.5rem;
          font-size: 0.95rem !important;
          padding: 0.8rem 2.5rem !important;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
