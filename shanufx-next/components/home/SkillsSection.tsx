'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { motion } from 'framer-motion';
import type { Skill } from '@/lib/types';

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('label'));
    const unsub = onSnapshot(q, (snap) => {
      setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill)));
    }, () => {});
    return unsub;
  }, []);

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="section-pad">
      <div className="container-1100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">Tech Stack</span>
          <h2 className="section-title">
            Skills & <span className="text-gradient">Tools</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="skills-grid">
          {skills.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="skill-card glass-card skill-card-pad"
              style={{ '--_accent': s.color, '--_accent-bg': `${s.color}18` } as React.CSSProperties}
            >
              <div className="skill-icon-wrap">
                <i className={`${s.icon} skill-icon`} />
              </div>
              <h3 className="skill-name">{s.label}</h3>
              <span className="skill-level">{s.level}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
