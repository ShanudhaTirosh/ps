'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTyping } from '@/lib/hooks/useTyping';
import Image from 'next/image';

const WORDS = [
  'NovaMesh Developer',
  'Full-Stack Developer',
  'Android Innovator',
  'IoT Engineer',
  'Bot Architect',
  'System Optimizer',
];

export default function Hero() {
  const typed = useTyping(WORDS);
  const router = useRouter();

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hero-content"
        >
          <div className="hero-code-block" onClick={() => router.push('/admin')}>
            System.out.println(&quot;Hello, World!&quot;);
          </div>

          <h1 className="hero-title-large">
            I am <br />
            <span className="text-gradient">ShanuFx</span>
          </h1>

          <div className="hero-typing-wrap">
            {typed}<span className="cursor">|</span>
          </div>

          <div className="hero-bullet-points">
            <p>&gt; Pushing Android System Internals to the limit.</p>
            <p>&gt; Stabilizing mobile networking with NovaMesh.</p>
            <p>&gt; Full-stack development, performance-first mindset.</p>
          </div>

          <div className="hero-tags">
            <span className="hero-tag hero-tag-internals"><i className="fas fa-microchip"/> INTERNALS</span>
            <span className="hero-tag hero-tag-networking"><i className="fas fa-network-wired"/> NETWORKING</span>
            <span className="hero-tag hero-tag-iot"><i className="fas fa-robot"/> IOT</span>
            <span className="hero-tag hero-tag-fullstack"><i className="fas fa-code"/> FULL-STACK</span>
          </div>

          <div className="hero-btn-row">
            <a href="#innovations" className="btn-primary"
              onClick={(e) => { e.preventDefault(); document.getElementById('innovations')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Explore Innovations 🚀
            </a>
            <a href="https://github.com/ShanudhaTirosh" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <i className="fab fa-github" /> GitHub
            </a>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="hero-image-col"
        >
          <div className="hero-circle-wrap">
            <div className="hero-img-inner">
              <Image 
                src="/assets/img/profile.jpg" 
                alt="ShanuFx Profile" 
                fill 
                style={{ objectFit: 'cover' }} 
                priority
                sizes="(max-width: 768px) 300px, 400px"
              />
            </div>
            
            <div className="floating-badge badge-tl">
              <i className="fas fa-network-wired" /> NovaMesh
            </div>
            <div className="floating-badge badge-br">
              <i className="fas fa-bolt" /> Performance
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
