import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATIC_PROJECTS = [
  { id: 'p1', title: 'NovaMesh Android', category: 'Android', status: 'Active', icon: 'fas fa-network-wired', color: '#7c3aed', desc: 'System-level Android utility providing granular control over networking stack. Stabilizes data connections and optimizes hotspot for power users.', tags: ['Java','Android','System'], link: 'https://github.com/ShanudhaTirosh/Novamesh', stars: 12 },
  { id: 'p2', title: 'SHANU-MD', category: 'Bot', status: 'Active', icon: 'fab fa-whatsapp', color: '#10b981', desc: 'Advanced multi-device WhatsApp bot with plugin hot-reload, movie scrapers, media downloaders, and full group management.', tags: ['Node.js','Baileys','Firebase'], link: 'https://github.com/ShanudhaTirosh/SHANU-MD', stars: 45 },
  { id: 'p3', title: 'Smart IoT Plant', category: 'IoT', status: 'Completed', icon: 'fas fa-seedling', color: '#06b6d4', desc: 'ESP-8266 automated plant care with DHT11 climate sensing, OLED display, OTA updates, and Blynk integration.', tags: ['C++','ESP8266','IoT'], link: 'https://github.com/ShanudhaTirosh/Esp8266-smart-iot-progect', stars: 8 },
  { id: 'p4', title: 'NovaNetX VPN Platform', category: 'Web', status: 'Active', icon: 'fas fa-shield-alt', color: '#f472b6', desc: 'V2Ray VPN subscription platform for Sri Lankan users with React SPA, Node.js API, and WhatsApp bot integration.', tags: ['React','Node.js','V2Ray'], link: 'https://github.com/ShanudhaTirosh', stars: 5 },
  { id: 'p5', title: 'HotspotX Android', category: 'Android', status: 'Active', icon: 'fas fa-wifi', color: '#7c3aed', desc: 'Smart Hotspot Router app built with Kotlin + Jetpack Compose + MVVM + NanoHTTPD. No-root required version available.', tags: ['Kotlin','Jetpack Compose','MVVM'], link: 'https://github.com/ShanudhaTirosh', stars: 6 },
  { id: 'p6', title: 'FlexPOS / NexusPOS', category: 'Web', status: 'Completed', icon: 'fas fa-cash-register', color: '#10b981', desc: 'Full-featured POS systems with RBAC, glassmorphism UI, barcode scanning, Firebase backend and Chart.js analytics.', tags: ['Firebase','JS','Chart.js'], link: 'https://github.com/ShanudhaTirosh', stars: 9 },
  // Mini Utilities
  { id: 'sub1', title: 'Financial Calculator', category: 'Web', status: 'Completed', icon: 'fas fa-calculator', color: '#10b981', desc: 'A comprehensive web-based financial calculator for everyday utility.', tags: ['HTML','CSS','JS'], link: '/projects_sub/Financial Calculator.html' },
  { id: 'sub2', title: 'Image Gallery', category: 'Web', status: 'Completed', icon: 'fas fa-images', color: '#06b6d4', desc: 'A sleek, responsive image gallery showcasing web UI patterns.', tags: ['HTML','CSS','JS'], link: '/projects_sub/ImageGallery.html' },
  { id: 'sub3', title: 'QR Code Generator', category: 'Web', status: 'Completed', icon: 'fas fa-qrcode', color: '#7c3aed', desc: 'Instant QR code generation utility built with vanilla web technologies.', tags: ['HTML','CSS','JS'], link: '/projects_sub/QRCodeGenerator.html' },
  { id: 'sub4', title: 'To-Do List App', category: 'Web', status: 'Completed', icon: 'fas fa-list-check', color: '#f472b6', desc: 'A clean and functional task management app to boost productivity.', tags: ['HTML','CSS','JS'], link: '/projects_sub/ToDoList.html' },
  { id: 'sub5', title: 'Typing Speed Test', category: 'Web', status: 'Completed', icon: 'fas fa-keyboard', color: '#06b6d4', desc: 'Interactive typing speed test to measure WPM and accuracy.', tags: ['HTML','CSS','JS'], link: '/projects_sub/TypingSpeedTest.html' },
  { id: 'sub6', title: 'Unit Converter', category: 'Web', status: 'Completed', icon: 'fas fa-exchange-alt', color: '#10b981', desc: 'Versatile unit converter supporting multiple metrics and measurements.', tags: ['HTML','CSS','JS'], link: '/projects_sub/UnitConverter.html' },
  { id: 'sub7', title: 'Standard Calculator', category: 'Web', status: 'Completed', icon: 'fas fa-calculator', color: '#7c3aed', desc: 'A beautiful standard calculator featuring glassmorphism design.', tags: ['HTML','CSS','JS'], link: '/projects_sub/calculator.html' },
  { id: 'sub8', title: 'Calendar Widget', category: 'Web', status: 'Completed', icon: 'fas fa-calendar-alt', color: '#f472b6', desc: 'Dynamic calendar widget with event tracking capabilities.', tags: ['HTML','CSS','JS'], link: '/projects_sub/calender.html' },
  { id: 'sub9', title: 'Analog Clock', category: 'Web', status: 'Completed', icon: 'fas fa-clock', color: '#06b6d4', desc: 'Real-time animated analog clock using CSS transforms.', tags: ['HTML','CSS','JS'], link: '/projects_sub/clock.html' },
  { id: 'sub10', title: 'Math Solver', category: 'Web', status: 'Completed', icon: 'fas fa-square-root-alt', color: '#10b981', desc: 'Advanced mathematical equation solver and utility.', tags: ['HTML','CSS','JS'], link: '/projects_sub/mathsolver.html' },
];

const CATS = ['All', 'Android', 'Web', 'Bot', 'IoT'];

export default function Showcase() {
  const [projects, setProjects] = useState(STATIC_PROJECTS);
  const [cat, setCat]           = useState('All');
  const [search, setSearch]     = useState('');

  // Merge Firestore projects on top
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const fb = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects([...fb, ...STATIC_PROJECTS]);
    }, () => {});
    return unsub;
  }, []);

  const filtered = projects.filter(p => {
    const matchCat  = cat === 'All' || p.category === cat;
    const matchSrch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSrch;
  });

  const linkMap = {
    "Clock": "/projects_sub/clock.html",
    "Calendar": "/projects_sub/calender.html",
    "Task List": "/projects_sub/ToDoList.html",
    "Gallery": "/projects_sub/ImageGallery.html",
    "Unit Conv": "/projects_sub/UnitConverter.html",
    "Math Solver": "/projects_sub/mathsolver.html",
    "Typing Test": "/projects_sub/TypingSpeedTest.html",
    "QR Gen": "/projects_sub/QRCodeGenerator.html",
    "Finance Calc": "/projects_sub/Financial Calculator.html",
    "Scientific": "/projects_sub/calculator.html"
  };

  const getProjectLink = (p) => {
    if (p.link) return p.link;
    if (linkMap[p.title]) return linkMap[p.title];
    return null;
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="bg-noise" /><div className="grid-bg" />
      <Navbar />

      <main style={{ paddingTop: '7rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-purple">Premium Showcase</span>
            <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontFamily: 'Syne,sans-serif', color: '#f1f0f7', marginTop: '1rem', marginBottom: '0.5rem' }}>
              ShanuFx <span className="text-gradient">Innovations</span>
            </h1>
            <div className="section-divider" />
            <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto', fontFamily: 'JetBrains Mono,monospace', fontSize: '0.82rem' }}>
              _A curated collection of projects spanning Android, IoT, full-stack, and bot development
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: '0.45rem 1.1rem', borderRadius: 50, cursor: 'pointer',
                  fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                  background: cat === c ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.04)',
                  color: cat === c ? '#fff' : '#4b5563',
                  border: cat === c ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s',
                }}>
                {c}
              </button>
            ))}
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                padding: '0.45rem 1rem', borderRadius: 50, border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem',
                outline: 'none', width: 160,
              }} />
          </div>

          {/* Grid */}
          <motion.div layout className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filtered.map(p => {
                const resolvedLink = getProjectLink(p);
                return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={p.id} 
                  className="project-card glass-card" 
                  style={{ borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="card-glow" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${p.color || '#7c3aed'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={p.icon || 'fas fa-code'} style={{ color: p.color || '#7c3aed', fontSize: '1.3rem' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {p.stars && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i className="fas fa-star" style={{ color: '#f59e0b' }} />{p.stars}</span>}
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 50, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'JetBrains Mono,monospace',
                        background: p.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                        color: p.status === 'Active' ? '#34d399' : '#4b5563',
                        border: `1px solid ${p.status === 'Active' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      }}>{p.status || 'Project'}</span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: 'Syne,sans-serif', color: '#f1f0f7', fontSize: '1.05rem', marginBottom: '0.6rem' }}>{p.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '1rem', flexGrow: 1 }}>{p.desc}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {(p.tags || []).map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>

                  {resolvedLink && (
                    <a href={resolvedLink} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', color: p.color || '#7c3aed', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}
                      onMouseOver={e=>e.currentTarget.style.color='#f1f0f7'}
                      onMouseOut={e=>e.currentTarget.style.color=p.color||'#7c3aed'}>
                      {resolvedLink.includes('github.com') ? (
                        <>explore.repo() _ <i className="fab fa-github" /></>
                      ) : (
                        <>view.demo() _ <i className="fas fa-external-link-alt" /></>
                      )}
                    </a>
                  )}
                </motion.div>
              )})}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#4b5563', fontFamily: 'JetBrains Mono,monospace' }}>
              No projects found for "{search || cat}"
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
