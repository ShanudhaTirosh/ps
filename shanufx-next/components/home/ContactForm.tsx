'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        read: false,
        createdAt: serverTimestamp(),
      });
      setStatus('ok');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('err');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section-pad">
      <div className="container-650">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge badge-purple">Get in Touch</span>
          <h2 className="section-title">
            Contact <span className="text-gradient">Me</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card form-card"
        >
          <div className="form-group">
            <label className="form-label">YOUR NAME</label>
            <input
              className="form-input"
              type="text"
              placeholder="John Doe"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group-lg">
            <label className="form-label">MESSAGE</label>
            <textarea
              className="form-input form-textarea-fixed"
              placeholder="Tell me about your project..."
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : status === 'ok' ? '✓ Sent!' : 'Send Message'}
          </button>

          {status === 'ok' && (
            <p className="form-success">
              Thank you! I&apos;ll get back to you soon.
            </p>
          )}
          {status === 'err' && (
            <p className="form-error">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
