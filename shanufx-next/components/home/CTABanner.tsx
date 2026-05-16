'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="section-pad">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="cta-inner"
      >
        <h2 className="cta-title">
          Ready to <span className="text-gradient">build something</span> together?
        </h2>
        <p className="cta-desc">
          Whether it&apos;s a complex Android tool, a full-stack platform, or an IoT solution — let&apos;s make it happen.
        </p>
        <div className="btn-row">
          <a href="#contact" className="btn-primary"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <i className="fas fa-paper-plane" /> Get in Touch
          </a>
          <Link href="/testimonials" className="btn-ghost">
            <i className="fas fa-comment-dots" /> Read Testimonials
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
