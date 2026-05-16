'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/lib/types';

const STATIC_PROJECTS: Project[] = [
  { id: 'p1', title: 'NovaMesh Android', category: 'Android', status: 'Active', icon: 'fas fa-network-wired', color: '#7c3aed', desc: 'System-level Android utility providing granular control over networking stack. Stabilizes data connections and optimizes hotspot for power users.', tags: ['Java','Android','System'], link: 'https://github.com/ShanudhaTirosh/Novamesh', stars: 12 },
  { id: 'p2', title: 'SHANU-MD', category: 'Bot', status: 'Active', icon: 'fab fa-whatsapp', color: '#10b981', desc: 'Advanced multi-device WhatsApp bot with plugin hot-reload, movie scrapers, media downloaders, and full group management.', tags: ['Node.js','Baileys','Firebase'], link: 'https://github.com/ShanudhaTirosh/SHANU-MD', stars: 45 },
  { id: 'p3', title: 'Smart IoT Plant', category: 'IoT', status: 'Completed', icon: 'fas fa-seedling', color: '#06b6d4', desc: 'ESP-8266 automated plant care with DHT11 climate sensing, OLED display, OTA updates, and Blynk integration.', tags: ['C++','ESP8266','IoT'], link: 'https://github.com/ShanudhaTirosh/Esp8266-smart-iot-progect', stars: 8 },
  { id: 'p4', title: 'NovaNetX VPN Platform', category: 'Web', status: 'Active', icon: 'fas fa-shield-alt', color: '#f472b6', desc: 'V2Ray VPN subscription platform for Sri Lankan users with React SPA, Node.js API, and WhatsApp bot integration.', tags: ['React','Node.js','V2Ray'], link: 'https://github.com/ShanudhaTirosh', stars: 5 },
  { id: 'p5', title: 'HotspotX Android', category: 'Android', status: 'Active', icon: 'fas fa-wifi', color: '#7c3aed', desc: 'Smart Hotspot Router app built with Kotlin + Jetpack Compose + MVVM + NanoHTTPD. No-root required version available.', tags: ['Kotlin','Jetpack Compose','MVVM'], link: 'https://github.com/ShanudhaTirosh', stars: 6 },
  { id: 'p6', title: 'FlexPOS / NexusPOS', category: 'Web', status: 'Completed', icon: 'fas fa-cash-register', color: '#10b981', desc: 'Full-featured POS systems with RBAC, glassmorphism UI, barcode scanning, Firebase backend and Chart.js analytics.', tags: ['Firebase','JS','Chart.js'], link: 'https://github.com/ShanudhaTirosh', stars: 9 },
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

export default function ShowcaseClient() {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const fb = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      setProjects([...fb, ...STATIC_PROJECTS]);
    }, () => {});
    return unsub;
  }, []);

  const filtered = projects.filter(p => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchSrch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSrch;
  });

  return (
    <>
      {/* Header */}
      <div className="showcase-header">
        <span className="badge badge-purple">Premium Showcase</span>
        <h1 className="section-title-xl">
          ShanuFx <span className="text-gradient">Innovations</span>
        </h1>
        <div className="section-divider" />
        <p className="section-subtitle">
          _A curated collection of projects spanning Android, IoT, full-stack, and bot development
        </p>
      </div>

      {/* Filters */}
      <div className="showcase-filters">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`showcase-filter-btn ${cat === c ? 'showcase-filter-btn--active' : 'showcase-filter-btn--inactive'}`}>
            {c}
          </button>
        ))}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="showcase-search" />
      </div>

      {/* Grid */}
      <motion.div layout className="showcase-grid">
        <AnimatePresence>
          {filtered.map(p => {
            const resolvedLink = p.link || null;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="project-card glass-card project-card-inner"
                style={{ '--_accent': p.color || '#7c3aed', '--_accent-bg': `${p.color || '#7c3aed'}18` } as React.CSSProperties}
              >
                <div className="card-glow" />
                <div className="project-header">
                  <div className="project-icon-wrap">
                    <i className={`${p.icon || 'fas fa-code'} project-icon`} />
                  </div>
                  <div className="project-meta">
                    {p.stars && <span className="project-stars"><i className="fas fa-star star-icon" />{p.stars}</span>}
                    <span className={`project-status ${p.status === 'Active' ? 'project-status-active' : 'project-status-other'}`}>
                      {p.status || 'Project'}
                    </span>
                  </div>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tags">
                  {(p.tags || []).map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
                {resolvedLink && (
                  <a href={resolvedLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    {resolvedLink.includes('github.com') ? (
                      <>explore.repo() _ <i className="fab fa-github" /></>
                    ) : (
                      <>view.demo() _ <i className="fas fa-external-link-alt" /></>
                    )}
                  </a>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="showcase-empty">
          No projects found for &quot;{search || cat}&quot;
        </div>
      )}
    </>
  );
}
