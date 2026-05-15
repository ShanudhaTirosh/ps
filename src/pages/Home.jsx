import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleCanvas from '../components/ParticleCanvas';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';

/* ── Typing effect hook ── */
function useTyping(words, speed = 80, eraseSpeed = 40, pause = 2000) {
  const [text, setText]   = useState('');
  const [phase, setPhase] = useState('type');
  const idx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    let timer;
    const word = words[idx.current];

    if (phase === 'type') {
      if (charIdx.current < word.length) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current + 1));
          charIdx.current++;
        }, speed);
      } else {
        timer = setTimeout(() => setPhase('erase'), pause);
      }
    } else {
      if (charIdx.current > 0) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current - 1));
          charIdx.current--;
        }, eraseSpeed);
      } else {
        idx.current = (idx.current + 1) % words.length;
        setPhase('type');
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, words, speed, eraseSpeed, pause]);

  return text;
}

/* ── Skills data now fetched dynamically ── */

/* ── Roles ── */
const ROLES = [
  'Android System Specialist',
  'NovaMesh Developer',
  'IoT Integrator',
  'Full-Stack Architect',
  'Performance Engineer',
  'Creative Technologist',
];

export default function Home() {
  const navigate = useNavigate();
  const typedText = useTyping(ROLES);
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'skills'), orderBy('label')),
      (snapshot) => setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      (error) => console.error("Error fetching skills:", error)
    );
    return () => unsub();
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: serverTimestamp(),
        read: false,
      });
      setStatus('ok');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('err');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* FA CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <div className="bg-noise" />
      <div className="grid-bg" />
      <ParticleCanvas />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ══════════════════ HERO ══════════════════ */}
        <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', justifyContent: 'space-between' }}>

              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ flex: '1 1 340px' }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', color: '#06b6d4', letterSpacing: '0.05em' }}>
                    System.out.println("Hello, World!")<span onClick={() => navigate('/admin')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'default' }}>;</span>
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontFamily: 'Syne,sans-serif', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#f1f0f7' }}>
                  I am <br />
                  <span className="text-gradient">ShanuFx</span>
                </h1>
                <p className="typing-cursor" style={{ fontSize: '1.2rem', color: '#94a3b8', height: '1.8rem', marginBottom: '0.75rem' }}>
                  {typedText}
                </p>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                  &gt; Pushing Android System Internals to the limit.<br />
                  &gt; Stabilizing mobile networking with NovaMesh.<br />
                  &gt; Full-stack development, performance-first mindset.
                </p>

                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  <span className="badge badge-purple"><i className="fas fa-microchip" /> Internals</span>
                  <span className="badge badge-cyan"><i className="fas fa-network-wired" /> Networking</span>
                  <span className="badge badge-green"><i className="fas fa-robot" /> IoT</span>
                  <span className="badge badge-pink"><i className="fas fa-code" /> Full-Stack</span>
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <a href="#innovations" className="btn-primary">
                    Explore Innovations <i className="fas fa-rocket" />
                  </a>
                  <a href="https://github.com/ShanudhaTirosh" target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <i className="fab fa-github" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Profile */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ flex: '0 0 280px', display: 'flex', justifyContent: 'center' }}
              >
                <div style={{ position: 'relative' }}>
                  {/* Glow rings */}
                  <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: '1px solid rgba(124,58,237,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
                  <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: '1px solid rgba(6,182,212,0.1)' }} />
                  <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(124,58,237,0.2),transparent 70%)', filter: 'blur(16px)' }} />

                  {/* Photo */}
                  <div className="floating">
                    <img src="https://shanudhatirosh.github.io/assets/img/profile.jpg"
                         alt="Shanudha Tirosh (ShanuFx)"
                         style={{ width: 260, height: 260, borderRadius: '50%', objectFit: 'cover',
                           border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
                  </div>

                  {/* Floating chips */}
                  <div className="glass-card" style={{ position: 'absolute', bottom: -8, right: -12, borderRadius: 12, padding: '0.5rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                    <i className="fas fa-bolt" style={{ color: '#7c3aed' }} /> Performance
                  </div>
                  <div className="glass-card" style={{ position: 'absolute', top: -8, left: -12, borderRadius: 12, padding: '0.5rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                    <i className="fas fa-network-wired" style={{ color: '#06b6d4' }} /> NovaMesh
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
          >
            <span style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.2em', color: '#4b5563', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,#4b5563,transparent)' }} />
          </motion.div>
        </section>

        {/* ══════════════════ ABOUT ══════════════════ */}
        <section id="about" style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <span className="badge badge-purple">The Architect</span>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>My Journey</h2>
              <div className="section-divider" />
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ flex: '1 1 300px' }}
              >
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.8 }}>
                  [ <span style={{ color: '#7c3aed' }}>INIT</span> ] I'm a 17.5-year-old{' '}
                  <strong style={{ color: '#f1f0f7' }}>System Developer</strong> from Sri Lanka. Code is my canvas, performance is my priority.
                </p>
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.8 }}>
                  A student at <strong style={{ color: '#06b6d4' }}>G/Dharmashoka College</strong>, I specialize in{' '}
                  <b>Android System Internals</b> and <b>IoT automation</b>. I thrive making devices smarter, faster, more stable.
                </p>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                  As creator of <strong className="text-gradient">NovaMesh</strong>, I've built system-level utilities that stabilize mobile internet
                  and optimize hotspot management for power users.
                </p>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', color: '#7c3aed', fontWeight: 700 }}>
                  Exploring the limits of system performance. ⚡
                </p>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
                  {[['20+','Repositories'],['5k+','Reach'],['1','Purpose']].map(([val, lbl]) => (
                    <div key={lbl} className="glass-card" style={{ borderRadius: 16, padding: '1rem', textAlign: 'center' }}>
                      <div className="text-gradient" style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>{val}</div>
                      <div style={{ fontSize: '0.65rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skills list */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ flex: '1 1 300px' }}
              >
                <div className="glass-card" style={{ borderRadius: 20, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'radial-gradient(circle,rgba(124,58,237,0.15),transparent)', borderRadius: '50%' }} />
                  <h3 style={{ fontFamily: 'Syne,sans-serif', color: '#f1f0f7', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-terminal" style={{ color: '#7c3aed', fontSize: '0.85rem' }} />
                    </span>
                    Mission Critical Skills
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      ['fab fa-android','#7c3aed','Android Internals & OS Optimization'],
                      ['fas fa-wifi','#06b6d4','Networking Stability & Hotspot Systems'],
                      ['fas fa-layer-group','#7c3aed','Back-End Architecture (Node.js)'],
                      ['fas fa-microchip','#06b6d4','IoT Engineering (C++ / Arduino)'],
                      ['fas fa-shield-virus','#10b981','Cybersecurity & Defensive Coding'],
                      ['fas fa-project-diagram','#f472b6','API Design & System Integration'],
                    ].map(([icon, color, text]) => (
                      <li key={text} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.5rem 0.75rem', borderRadius: 10, color: '#94a3b8',
                        fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem',
                        transition: 'background 0.2s, color 0.2s', cursor: 'default',
                      }}
                        onMouseOver={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#f1f0f7'; }}
                        onMouseOut={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#94a3b8'; }}>
                        <i className={icon} style={{ color, width: 16, textAlign: 'center' }} />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ SKILLS ══════════════════ */}
        <section id="skills" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <span className="badge badge-cyan">Tech Arsenal</span>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>Technical Skills</h2>
              <div className="section-divider" />
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.82rem', color: '#4b5563' }}>_Optimizing stack for maximum performance</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '1rem' }}>
              {skills.map((s, i) => (
                <motion.div 
                  key={s.label} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="skill-card glass-card" 
                  style={{ padding: '1.5rem 1rem', textAlign: 'center' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <i className={s.icon} style={{ color: s.color, fontSize: '1.4rem' }} />
                  </div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', color: '#f1f0f7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{s.label}</h3>
                  <span style={{ fontSize: '0.65rem', color: s.color, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'JetBrains Mono,monospace' }}>{s.level}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ NEW SECTIONS ══════════════════ */}
        <Experience />
        <Services />
        <Testimonials limit={3} />

        {/* ══════════════════ INNOVATIONS ══════════════════ */}
        <section id="innovations" style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <span className="badge badge-purple">Featured Innovation</span>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>
                Powered by <span className="text-gradient">NovaMesh</span>
              </h2>
              <div className="section-divider" />
              <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                From system-level Android optimization to intelligent automation frameworks.
              </p>
              <a href="/showcase" className="btn-outline" style={{ padding: '0.65rem 1.5rem', fontSize: '0.82rem' }}>
                VIEW PREMIUM SHOWCASE <i className="fas fa-external-link-alt" style={{ marginLeft: '0.4rem' }} />
              </a>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {[
                { title: 'NovaMesh Android', icon: 'fas fa-network-wired', color: '#7c3aed', desc: 'A flagship utility providing granular control over Android\'s networking stack. Stabilizes data connections and enhances hotspot reliability for high-demand environments.', tags: ['System-Level Stability','Hotspot Optimization','Traffic Management'], link: 'https://github.com/ShanudhaTirosh/Novamesh' },
                { title: 'SHANU-MD', icon: 'fab fa-whatsapp', color: '#10b981', desc: 'An advanced multi-device WhatsApp bot built for speed, stability, and intelligent automation. Features plugin hot-reload and group management.', tags: ['Node.js','Baileys','Multi-device'], link: 'https://github.com/ShanudhaTirosh/SHANU-MD' },
                { title: 'Smart IoT Plant', icon: 'fas fa-seedling', color: '#06b6d4', desc: 'ESP-8266 powered automated plant care system with real-time moisture tracking, DHT11 climate sensing, and intelligent irrigation logic.', tags: ['ESP8266','C++','IoT','Blynk'], link: 'https://github.com/ShanudhaTirosh/Esp8266-smart-iot-progect' },
              ].map((p, i) => (
                <motion.div 
                  key={p.title} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="project-card glass-card" 
                  style={{ borderRadius: 20, padding: '2rem' }}
                >
                  <div className="card-glow" />
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <i className={p.icon} style={{ color: p.color, fontSize: '1.4rem' }} />
                  </div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', color: '#f1f0f7', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {p.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.78rem', color: p.color, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    onMouseOver={e=>e.currentTarget.style.color='#f1f0f7'}
                    onMouseOut={e=>e.currentTarget.style.color=p.color}>
                    explore.repo() _ <i className="fab fa-github" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA BANNER ══════════════════ */}
        <section style={{ padding: '5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)' }} />
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontFamily: 'Syne,sans-serif', color: '#f1f0f7', marginBottom: '1rem' }}>
              Ready to see what I can build?
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.7 }}>
              Explore my portfolio of projects — from web apps and mobile tools to creative designs.
            </p>
            <a href="/showcase" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
              Explore the Premium Showcase <i className="fas fa-arrow-right" />
            </a>
          </div>
        </section>

        {/* ══════════════════ CONTACT ══════════════════ */}
        <section id="contact" style={{ padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <span className="badge badge-purple">Let's Connect</span>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '1rem', color: '#f1f0f7' }}>Get In Touch</h2>
              <div className="section-divider" />
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.82rem', color: '#4b5563' }}>_Open for collaborations and technical discussions</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card" 
              style={{ borderRadius: 24, padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
            >
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#7c3aed,#06b6d4,#7c3aed)' }} />

              <form onSubmit={handleContact}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#4b5563', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Identity</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4b5563', pointerEvents: 'none' }} />
                    <input className="form-input" style={{ paddingLeft: '2.75rem' }} type="text" placeholder="Name / Organization" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#4b5563', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Communication Channel</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4b5563', pointerEvents: 'none' }} />
                    <input className="form-input" style={{ paddingLeft: '2.75rem' }} type="email" placeholder="email@address.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#4b5563', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transmission Details</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-terminal" style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#4b5563', pointerEvents: 'none' }} />
                    <textarea className="form-input" style={{ paddingLeft: '2.75rem', resize: 'none', minHeight: 120 }} placeholder="Your message here..." rows={5} required
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', borderRadius: 14 }}
                  disabled={status === 'sending'}>
                  {status === 'sending'
                    ? <><i className="fas fa-spinner fa-spin" /> Sending...</>
                    : status === 'ok'
                    ? <><i className="fas fa-check" /> Sent!</>
                    : <>DISPATCH MESSAGE <i className="fas fa-paper-plane" /></>}
                </motion.button>

                {status === 'ok' && <p style={{ textAlign: 'center', color: '#10b981', fontSize: '0.82rem', marginTop: '0.75rem' }}>✅ Message received! I'll get back to you soon.</p>}
                {status === 'err' && <p style={{ textAlign: 'center', color: '#f43f5e', fontSize: '0.82rem', marginTop: '0.75rem' }}>❌ Error sending. Please try again.</p>}
              </form>
            </motion.div>

            {/* Social icons */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono,monospace', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1.25rem' }}>Direct Uplinks</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                {[
                  ['fab fa-facebook',    'https://web.facebook.com/tirosh.shanudha/'],
                  ['fab fa-instagram',   'https://www.instagram.com/shanudha_tirosh/'],
                  ['fab fa-linkedin-in', 'https://www.linkedin.com/in/shanudhatirosh/'],
                  ['fab fa-github',      'https://github.com/ShanudhaTirosh'],
                ].map(([icon, href]) => (
                  <a key={icon} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '1.3rem', color: '#4b5563', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e=>{e.currentTarget.style.color='#a855f7'; e.currentTarget.style.transform='translateY(-4px)';}}
                    onMouseOut={e=>{e.currentTarget.style.color='#4b5563'; e.currentTarget.style.transform='translateY(0)';}}>
                    <i className={icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1);} 50%{opacity:0.6;transform:scale(1.04);} }
      `}</style>
    </div>
  );
}
