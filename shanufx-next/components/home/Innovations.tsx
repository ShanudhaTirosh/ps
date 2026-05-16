'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const FEATURED = [
  { id: 'p1', title: 'NovaMesh Android', category: 'Android', status: 'Active', icon: 'fas fa-network-wired', color: '#7c3aed', desc: 'System-level Android utility providing granular control over networking stack.', tags: ['Java', 'Android', 'System'], link: 'https://github.com/ShanudhaTirosh/Novamesh', stars: 12 },
  { id: 'p2', title: 'SHANU-MD', category: 'Bot', status: 'Active', icon: 'fab fa-whatsapp', color: '#10b981', desc: 'Advanced multi-device WhatsApp bot with plugin hot-reload and rich features.', tags: ['Node.js', 'Baileys', 'Firebase'], link: 'https://github.com/ShanudhaTirosh/SHANU-MD', stars: 45 },
  { id: 'p3', title: 'Smart IoT Plant', category: 'IoT', status: 'Completed', icon: 'fas fa-seedling', color: '#06b6d4', desc: 'ESP-8266 automated plant care with DHT11 sensing and Blynk integration.', tags: ['C++', 'ESP8266', 'IoT'], link: 'https://github.com/ShanudhaTirosh/Esp8266-smart-iot-progect', stars: 8 },
  { id: 'p4', title: 'NovaNetX VPN Platform', category: 'Web', status: 'Active', icon: 'fas fa-shield-alt', color: '#f472b6', desc: 'V2Ray VPN subscription platform with React SPA and Node.js API.', tags: ['React', 'Node.js', 'V2Ray'], link: 'https://github.com/ShanudhaTirosh', stars: 5 },
];

export default function Innovations() {
  return (
    <section id="innovations" className="section-pad">
      <div className="container-1100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">Featured Work</span>
          <h2 className="section-title">
            ShanuFx <span className="text-gradient">Innovations</span>
          </h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            _Highlights from my portfolio of Android, IoT, and full-stack projects
          </p>
        </motion.div>

        <div className="innovations-grid">
          {FEATURED.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="project-card glass-card project-card-inner"
              style={{ '--_accent': p.color, '--_accent-bg': `${p.color}18` } as React.CSSProperties}
            >
              <div className="card-glow" />
              <div className="project-header">
                <div className="project-icon-wrap">
                  <i className={`${p.icon} project-icon`} />
                </div>
                <div className="project-meta">
                  {p.stars && (
                    <span className="project-stars">
                      <i className="fas fa-star star-icon" />{p.stars}
                    </span>
                  )}
                  <span className={`project-status ${p.status === 'Active' ? 'project-status-active' : 'project-status-other'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                explore.repo() _ <i className="fab fa-github" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginTop: '3rem' }}
        >
          <Link href="/showcase" className="btn-primary">
            <i className="fas fa-th-large" /> View Full Showcase
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
