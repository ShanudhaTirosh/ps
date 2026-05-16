'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { motion } from 'framer-motion';
import type { Service } from '@/lib/types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, 'services'), orderBy('order')))
      .then(snap => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service))))
      .catch(() => {});
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="section-pad">
      <div className="container-1100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">What I Do</span>
          <h2 className="section-title">
            Services & <span className="text-gradient">Expertise</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card service-card-pad"
              style={{ '--_accent': s.color, '--_accent-bg': `${s.color}18` } as React.CSSProperties}
            >
              <div className="card-glow" />
              <div className="service-icon-wrap">
                <i className={`${s.icon} service-icon`} />
              </div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
