'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const stats = [
    { val: '3+', label: 'Years Coding' },
    { val: '15+', label: 'Projects' },
    { val: '1K+', label: 'GitHub Commits' },
    { val: '5+', label: 'Languages' },
  ];

  return (
    <section id="about" className="section-pad">
      <div className="container-1100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header-lg"
        >
          <span className="badge badge-purple">About Me</span>
          <h2 className="section-title">
            Who is <span className="text-gradient">ShanuFx</span>?
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="about-grid">
          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="profile-frame">
              <Image
                src="/assets/img/profile.jpg"
                alt="Shanudha Tirosh"
                width={350}
                height={350}
                className="profile-img"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="bio-text">
              I&apos;m a 17-year-old self-taught developer from Sri Lanka with a deep passion for
              system-level Android development, full-stack web platforms, and IoT innovation.
            </p>
            <p className="bio-text-last">
              From building NovaMesh (a system-level Android networking tool) to architecting
              multi-device WhatsApp bots, I focus on creating tools that solve real problems
              with clean code and innovative approaches.
            </p>

            {/* Stats grid */}
            <div className="stats-grid-2x2">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card stat-card-mini"
                >
                  <div className="stat-val-mini">{s.val}</div>
                  <div className="stat-lbl-mini">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
