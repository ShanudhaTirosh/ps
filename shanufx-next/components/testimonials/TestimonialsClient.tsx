'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Testimonials from '@/components/home/Testimonials';

export default function TestimonialsClient() {
  const [form, setForm] = useState({ name: '', role: '', text: '', avatar: '' });
  const [status, setStatus] = useState<null | 'submitting' | 'ok' | 'err'>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section-header-lg"
      >
        <span className="badge badge-purple">Community</span>
        <h1 className="section-title-xxl">Testimonials</h1>
        <p className="section-subtitle-lg">
          See what others are saying about my work, or share your own experience.
        </p>
        <div className="section-divider" />
      </motion.div>

      <Testimonials />

      <section className="section-pad-y">
        <div className="container-650">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card form-card"
          >
            <div className="section-header-lg">
              <h2 className="section-title-md">Share Your Feedback</h2>
              <p className="section-subtitle-md">Your testimonial will be visible on the site.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">YOUR NAME</label>
                <input className="form-input" type="text" placeholder="John Doe" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">ROLE / COMPANY</label>
                <input className="form-input" type="text" placeholder="Developer at Google" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">AVATAR URL (OPTIONAL)</label>
                <input className="form-input" type="url" placeholder="https://example.com/avatar.jpg" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />
              </div>
              <div className="form-group-lg">
                <label className="form-label">YOUR TESTIMONIAL</label>
                <textarea className="form-input form-textarea-sm" placeholder="How was your experience working with ShanuFx?" required rows={5} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : status === 'ok' ? 'Submitted!' : 'Submit Testimonial'}
              </button>
              {status === 'ok' && <p className="form-success">Thank you for your feedback! It&apos;s now live.</p>}
              {status === 'err' && <p className="form-error">Something went wrong. Please try again.</p>}
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
