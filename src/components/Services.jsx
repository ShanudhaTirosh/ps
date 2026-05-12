import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'services'), orderBy('order')),
      (snapshot) => {
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) return null;
  if (services.length === 0) return null;

  return (
    <section id="services" style={{ padding: '6rem 1.5rem', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-cyan">What I Do</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>Services</h2>
          <div className="section-divider" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {services.map((srv, i) => (
            <motion.div
              key={srv.id || srv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card"
              style={{ padding: '2rem', borderRadius: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, ${srv.color}33, transparent)`, borderRadius: '50%' }} />
              <div style={{ width: 60, height: 60, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${srv.color}1a`, borderRadius: '50%' }}>
                <i className={srv.icon} style={{ fontSize: '1.8rem', color: srv.color }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#f1f0f7', marginBottom: '1rem' }}>{srv.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
