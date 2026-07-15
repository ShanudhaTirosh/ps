'use client';
import { motion } from 'framer-motion';

const COMMUNITY_URL = 'https://community.shanutechx.com';

export default function CommunityCTA() {
  return (
    <section id="community" className="section-pad">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="community-cta-card glass-card"
        >
          {/* Left accent bar */}
          <div className="community-cta-accent" />

          <div className="community-cta-content">
            <div className="community-cta-badge">
              <span className="community-live-dot" />
              Live Community
            </div>

            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
              Join the <span className="text-gradient">ShanuFx Community</span>
            </h2>

            <p style={{ color: 'var(--text-2)', fontSize: '1rem', maxWidth: 520, lineHeight: 1.7 }}>
              Discuss Android internals, share projects, get help, and connect
              with developers from Sri Lanka and beyond. Reddit-style forum
              and real-time Discord-style chat in one place.
            </p>

            <div className="community-cta-stats">
              <div className="cta-stat">
                <span className="cta-stat-num text-gradient">Forum</span>
                <span className="cta-stat-label">Reddit-style posts</span>
              </div>
              <div className="cta-stat-divider" />
              <div className="cta-stat">
                <span className="cta-stat-num text-gradient">Chat</span>
                <span className="cta-stat-label">Real-time channels</span>
              </div>
              <div className="cta-stat-divider" />
              <div className="cta-stat">
                <span className="cta-stat-num text-gradient">Admin</span>
                <span className="cta-stat-label">Full management panel</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <i className="fas fa-users" /> Enter Community
              </a>
              <a href={`${COMMUNITY_URL}/community`} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Browse Forum
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="community-cta-visual" aria-hidden="true">
            <div className="cta-ring cta-ring-1" />
            <div className="cta-ring cta-ring-2" />
            <div className="cta-ring cta-ring-3" />
            <i className="fas fa-users cta-icon" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .community-cta-card {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2.5rem;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .community-cta-accent {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--grad);
          border-radius: 2px 0 0 2px;
        }
        .community-cta-content { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
        .community-cta-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
          color: #22d3ee; font-size: 0.75rem; font-weight: 600;
          padding: 0.3rem 0.75rem; border-radius: 50px;
          width: fit-content; letter-spacing: 0.05em; text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .community-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 6px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .community-cta-stats {
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
        }
        .cta-stat { display: flex; flex-direction: column; gap: 0.15rem; }
        .cta-stat-num { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; }
        .cta-stat-label { font-size: 0.75rem; color: var(--text-3); }
        .cta-stat-divider { width: 1px; height: 32px; background: var(--border); }
        .community-cta-visual {
          width: 160px; height: 160px; flex-shrink: 0;
          position: relative; display: grid; place-items: center;
        }
        .cta-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(124,58,237,0.2);
          animation: spin 12s linear infinite;
        }
        .cta-ring-1 { width: 160px; height: 160px; }
        .cta-ring-2 { width: 110px; height: 110px; border-color: rgba(6,182,212,0.2); animation-duration: 8s; animation-direction: reverse; }
        .cta-ring-3 { width: 65px;  height: 65px;  border-color: rgba(124,58,237,0.35); animation-duration: 5s; }
        .cta-icon {
          font-size: 2rem;
          background: var(--grad); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          z-index: 1;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .community-cta-visual { display: none; }
          .community-cta-card { padding: 1.75rem; }
        }
      `}</style>
    </section>
  );
}
