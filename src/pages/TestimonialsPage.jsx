import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import ParticleCanvas from '../components/ParticleCanvas';

export default function TestimonialsPage() {
  const [form, setForm] = useState({ name: '', role: '', text: '', avatar: '' });
  const [status, setStatus] = useState(null); // null | 'submitting' | 'ok' | 'err'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.text) return;

    setStatus('submitting');
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...form,
        avatar: form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=7c3aed&color=fff`,
        createdAt: serverTimestamp(),
      });
      setStatus('ok');
      setForm({ name: '', role: '', text: '', avatar: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setStatus('err');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-noise" />
      <div className="grid-bg" />
      <ParticleCanvas />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '8rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span className="badge badge-purple">Community</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem' }}>Testimonials</h1>
            <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>
              See what others are saying about my work, or share your own experience.
            </p>
            <div className="section-divider" />
          </motion.div>

          <Testimonials />

          <section style={{ padding: '6rem 0' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card"
                style={{ borderRadius: 24, padding: '2.5rem', border: '1px solid var(--border-h)' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '1.8rem', color: '#f1f0f7', marginBottom: '0.5rem' }}>Share Your Feedback</h2>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Your testimonial will be visible on the site.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>YOUR NAME</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>ROLE / COMPANY</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Developer at Google"
                      required
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>AVATAR URL (OPTIONAL)</label>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={form.avatar}
                      onChange={e => setForm({ ...form, avatar: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>YOUR TESTIMONIAL</label>
                    <textarea
                      className="form-input"
                      style={{ resize: 'none', minHeight: 120 }}
                      placeholder="How was your experience working with ShanuFx?"
                      required
                      rows={5}
                      value={form.text}
                      onChange={e => setForm({ ...form, text: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Submitting...' : status === 'ok' ? 'Submitted!' : 'Submit Testimonial'}
                  </button>

                  {status === 'ok' && (
                    <p style={{ color: '#10b981', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                      Thank you for your feedback! It's now live.
                    </p>
                  )}
                  {status === 'err' && (
                    <p style={{ color: '#f43f5e', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
