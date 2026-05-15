import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Scroll spy logic
    let observer;
    if (location.pathname === '/') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { threshold: 0.1, rootMargin: "-15% 0px -45% 0px" });

      ['home', 'about', 'innovations', 'contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  // Smooth-scroll to a section id; if not on home, navigate there first
  const handleHashClick = (e, sectionId) => {
    e.preventDefault();
    setMobile(false);
    const scrollTo = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (location.pathname === '/') {
      scrollTo();
    } else {
      navigate('/');
      // Wait for the new page to mount before scrolling
      setTimeout(scrollTo, 150);
    }
  };

  const navLinks = [
    { label: 'Home',        type: 'hash',  sectionId: 'home'       },
    { label: 'About',       type: 'hash',  sectionId: 'about'      },
    { label: 'Innovations', type: 'hash',  sectionId: 'innovations'},
    { label: 'Showcase',    type: 'route', to: '/showcase'         },
    { label: 'Feedback',    type: 'route', to: '/testimonials'    },
    { label: 'Contact',     type: 'hash',  sectionId: 'contact'    },
  ];

  const renderLink = (l, extraClass = 'nav-link') => {
    let isActive = false;
    if (l.type === 'route') {
      isActive = location.pathname === l.to;
    } else if (location.pathname === '/') {
      isActive = activeSection === l.sectionId;
    }
    
    const className = `${extraClass} ${isActive ? 'active' : ''}`;

    if (l.type === 'hash') {
      return (
        <a
          href={`#${l.sectionId}`}
          className={className}
          onClick={(e) => handleHashClick(e, l.sectionId)}
        >
          {l.label}
        </a>
      );
    }
    return (
      <Link to={l.to} className={className} onClick={() => setMobile(false)}>
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
        <nav style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
            onClick={() => setMobile(false)}
          >
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
          <ul className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map(l => (
              <li key={l.label}>{renderLink(l)}</li>
            ))}
            <li>
              <a
                href="#contact"
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}
                onClick={(e) => handleHashClick(e, 'contact')}
              >
                Let's Talk
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setMobile(o => !o)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
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
            transition={{ duration: 0.25 }}
            className="mobile-nav-overlay"
          >
            {/* Close button */}
            <button
              onClick={() => setMobile(false)}
              className="mobile-close-btn"
              aria-label="Close menu"
            >
              ✕
            </button>

            <div className="mobile-nav-links">
              {navLinks.map(l => renderLink(l, 'mobile-nav-link'))}
              <a
                href="#contact"
                className="btn-primary mobile-cta"
                onClick={(e) => handleHashClick(e, 'contact')}
              >
                Let's Talk
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ── Desktop: hide hamburger ── */
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

        /* ── Nav links ── */
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

        /* ── Mobile overlay ── */
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
        .mobile-admin-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #374151;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
          margin-top: 1rem;
        }
        .mobile-admin-link:hover { color: #4b5563; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
