'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-1200">
        <div className="footer-socials">
          {[
            { icon: 'fab fa-github', href: 'https://github.com/ShanudhaTirosh', label: 'GitHub' },
            { icon: 'fab fa-linkedin', href: 'https://linkedin.com/in/shanudhatirosh', label: 'LinkedIn' },
            { icon: 'fab fa-whatsapp', href: 'https://wa.me/94773088875', label: 'WhatsApp' },
            { icon: 'fas fa-envelope', href: 'mailto:shanudhatirosh@gmail.com', label: 'Email' },
          ].map(s => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label={s.label}
              title={s.label}
            >
              <i className={s.icon} />
            </a>
          ))}
        </div>

        <div className="footer-links">
          {[
            { label: 'Home', href: '/' },
            { label: 'Showcase', href: '/showcase' },
            { label: 'Testimonials', href: '/testimonials' },
          ].map(l => (
            <Link key={l.label} href={l.href} className="footer-link">
              {l.label}
            </Link>
          ))}
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} SHANUTECHX (Shanudha Tirosh). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
