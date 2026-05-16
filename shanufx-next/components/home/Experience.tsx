'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { motion } from 'framer-motion';
import type { Experience as ExperienceType } from '@/lib/types';

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, 'experiences'), orderBy('order')))
      .then(snap => setExperiences(snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceType))))
      .catch(() => {});
  }, []);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-pad">
      <div className="container-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">Timeline</span>
          <h2 className="section-title">
            Experience
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="timeline">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="timeline-item"
            >
              {/* Timeline dot */}
              <div className="timeline-dot" />

              <div className="glass-card timeline-card">
                <div className="timeline-header">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <h4 className="timeline-company">{exp.company}</h4>
                <p className="timeline-desc">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
