import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'experiences'), orderBy('order')),
      (snapshot) => {
        setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching experiences:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) return null;
  if (experiences.length === 0) return null;

  return (
    <section id="experience" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-purple">Timeline</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>Experience</h2>
          <div className="section-divider" />
        </div>

        <div style={{ position: 'relative', borderLeft: '2px solid rgba(124, 58, 237, 0.2)', marginLeft: '1rem', paddingLeft: '2rem' }}>
          {experiences.map((exp, i) => (
            <motion.div 
              key={exp.id || i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ position: 'relative', marginBottom: '3rem' }}
            >
              <div style={{ position: 'absolute', left: '-2.4rem', top: '0.2rem', width: 14, height: 14, borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 10px #7c3aed' }} />
              <div className="glass-card" style={{ padding: '2rem', borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#f1f0f7', margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{exp.period}</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#a855f7', margin: '0 0 1rem 0' }}>{exp.company}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
