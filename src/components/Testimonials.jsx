import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Testimonials({ limit }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  const displayTestimonials = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <section id="testimonials" style={{ padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-purple">Feedback</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>Testimonials</h2>
          <div className="section-divider" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {displayTestimonials.map((test, i) => (
            <motion.div
              key={test.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card"
              style={{ padding: '2rem', borderRadius: 20, position: 'relative' }}
            >
              <i className="fas fa-quote-left" style={{ position: 'absolute', top: '1.5rem', right: '2rem', fontSize: '2rem', color: 'rgba(255,255,255,0.05)' }} />
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>
                "{test.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={test.avatar} alt={test.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(124, 58, 237, 0.5)' }} />
                <div>
                  <h4 style={{ margin: 0, color: '#f1f0f7', fontSize: '1rem' }}>{test.name}</h4>
                  <span style={{ color: '#06b6d4', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{test.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {limit && testimonials.length > limit && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/testimonials" className="btn-outline">
              View All Testimonials <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
