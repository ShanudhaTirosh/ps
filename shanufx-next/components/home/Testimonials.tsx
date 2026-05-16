'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { motion } from 'framer-motion';
import type { Testimonial } from '@/lib/types';
import Image from 'next/image';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
    }, () => {});
    return unsub;
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-pad">
      <div className="container-1100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">Feedback</span>
          <h2 className="section-title">
            What People <span className="text-gradient">Say</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card testimonial-card-pad"
            >
              <div className="card-glow" />
              <p className="testimonial-text">
                &quot;{t.text}&quot;
              </p>
              <div className="testimonial-author">
                <Image
                  src={t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=7c3aed&color=fff`}
                  alt={t.name}
                  width={42}
                  height={42}
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
