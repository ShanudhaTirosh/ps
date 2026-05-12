import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { icon: 'fab fa-github',      href: 'https://github.com/ShanudhaTirosh',             label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/in/shanudhatirosh/', label: 'LinkedIn' },
    { icon: 'fab fa-facebook',    href: 'https://web.facebook.com/tirosh.shanudha/',      label: 'Facebook' },
    { icon: 'fab fa-instagram',   href: 'https://www.instagram.com/shanudha_tirosh/',     label: 'Instagram' },
  ];

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '3rem 1.5rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{
            fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem',
            background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>ShanuFx</Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[['Home','/#home'],['About','/#about'],['Innovations','/#innovations'],['Showcase','/showcase'],['Contact','/#contact']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '0.82rem', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#94a3b8'} onMouseOut={e=>e.target.style.color='#4b5563'}>
              {label}
            </a>
          ))}
        </div>

        {/* Socials */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              aria-label={s.label}
              style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#4b5563', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.color='#a855f7'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseOut={e=>{e.currentTarget.style.color='#4b5563'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='translateY(0)';}}>
              <i className={s.icon}></i>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.72rem', color: '#4b5563', fontFamily: 'JetBrains Mono,monospace' }}>
          © {year} Shanudha Tirosh (ShanuFx) · Built with React + Firebase · Sri Lanka
        </p>
      </div>
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    </footer>
  );
}
