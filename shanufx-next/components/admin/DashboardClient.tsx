'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, getDoc, setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface Experience { [key: string]: unknown; id?: string; role?: string; company?: string; period?: string; desc?: string; order?: number; }
export interface Service { [key: string]: unknown; id?: string; title?: string; icon?: string; color?: string; desc?: string; order?: number; }
export interface Testimonial { [key: string]: unknown; id?: string; name?: string; role?: string; text?: string; avatar?: string; }
export interface Project { [key: string]: unknown; id?: string; title?: string; category?: string; status?: string; desc?: string; link?: string; icon?: string; color?: string; tags?: string[]; }
export interface Skill { [key: string]: unknown; id?: string; label?: string; icon?: string; level?: string; color?: string; }
export interface Message { id: string; name?: string; email?: string; message?: string; read?: boolean; createdAt?: { toDate?: () => Date }; }
export interface SiteSettings { discordWebhook?: string; siteTitle?: string; maintenance?: boolean; }

/* ── Toast ── */
function Toast({ msg, type, onClose }: { msg: string, type: string, onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

/* ── Confirm Modal ── */
function ConfirmModal({ msg, onConfirm, onCancel }: { msg: string, onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-sm">
        <h3 className="admin-confirm-title"><i className="fas fa-exclamation-triangle" /> Confirm Delete</h3>
        <p className="admin-confirm-msg">{msg}</p>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-admin btn-admin-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Experience Modal ── */
function ExperienceModal({ exp, onSave, onClose }: { exp: Experience | null, onSave: (f: Experience) => void, onClose: () => void }) {
  const [form, setForm] = useState<Experience>({ role: '', company: '', period: '', desc: '', order: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (exp) setForm({ role: exp.role || '', company: exp.company || '', period: exp.period || '', desc: exp.desc || '', order: exp.order || 0 });
    else setForm({ role: '', company: '', period: '', desc: '', order: 0 });
  }, [exp]);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>{exp ? 'Edit Experience' : 'Add Experience'}</h3>
        {[
          ['Role', 'role', 'text'],
          ['Company', 'company', 'text'],
          ['Period (e.g. 2023 - Present)', 'period', 'text'],
          ['Sort Order', 'order', 'number'],
        ].map(([label, key, type]) => (
          <div className="form-row" key={key as string}>
            <label htmlFor={`exp-${key as string}`}>{label as string}</label>
            <input id={`exp-${key as string}`} type={type as string} value={String((form as Record<string, unknown>)[key as string] || '')} onChange={e => setForm(f => ({ ...f, [key as string]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label htmlFor="exp-desc">Description</label>
          <textarea id="exp-desc" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={4} />
        </div>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Service Modal ── */
function ServiceModal({ srv, onSave, onClose }: { srv: Service | null, onSave: (f: Service) => void, onClose: () => void }) {
  const [form, setForm] = useState<Service>({ title: '', icon: 'fas fa-code', color: '#7c3aed', desc: '', order: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (srv) setForm({ title: srv.title || '', icon: srv.icon || 'fas fa-code', color: srv.color || '#7c3aed', desc: srv.desc || '', order: srv.order || 0 });
    else setForm({ title: '', icon: 'fas fa-code', color: '#7c3aed', desc: '', order: 0 });
  }, [srv]);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>{srv ? 'Edit Service' : 'Add Service'}</h3>
        {[
          ['Title', 'title', 'text'],
          ['Icon Class (FA)', 'icon', 'text'],
          ['Accent Color', 'color', 'color'],
          ['Sort Order', 'order', 'number'],
        ].map(([label, key, type]) => (
          <div className="form-row" key={key as string}>
            <label htmlFor={`srv-${key as string}`}>{label as string}</label>
            <input 
              id={`srv-${key as string}`}
              type={type as string} 
              value={String((form as Record<string, unknown>)[key as string] || '')} 
              onChange={e => setForm(f => ({ ...f, [key as string]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
              className={type === 'color' ? 'admin-color-picker' : ''}
            />
          </div>
        ))}
        <div className="form-row">
          <label htmlFor="srv-desc">Description</label>
          <textarea id="srv-desc" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={4} />
        </div>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Testimonial Modal ── */
function TestimonialModal({ test, onSave, onClose }: { test: Testimonial | null, onSave: (f: Testimonial) => void, onClose: () => void }) {
  const [form, setForm] = useState<Testimonial>({ name: '', role: '', text: '', avatar: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (test) setForm({ name: test.name || '', role: test.role || '', text: test.text || '', avatar: test.avatar || '' });
    else setForm({ name: '', role: '', text: '', avatar: '' });
  }, [test]);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>{test ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        {[
          ['Name', 'name', 'text'],
          ['Role / Company', 'role', 'text'],
          ['Avatar URL', 'avatar', 'text'],
        ].map(([label, key, type]) => (
          <div className="form-row" key={key as string}>
            <label htmlFor={`test-${key as string}`}>{label as string}</label>
            <input id={`test-${key as string}`} type={type as string} value={String((form as Record<string, unknown>)[key as string] || '')} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label htmlFor="test-desc">Feedback Text</label>
          <textarea id="test-desc" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} />
        </div>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Project Modal ── */
function ProjectModal({ proj, onSave, onClose }: { proj: Project | null, onSave: (f: Project) => void, onClose: () => void }) {
  const [form, setForm] = useState<Project & { tagsString?: string }>({
    title: '', category: 'Web', status: 'Active', desc: '',
    link: '', icon: 'fas fa-code', color: '#7c3aed', tagsString: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (proj) setForm({ 
      title: proj.title || '', category: proj.category || 'Web', status: proj.status || 'Active', 
      desc: proj.desc || '', link: proj.link || '', icon: proj.icon || 'fas fa-code', 
      color: proj.color || '#7c3aed', tagsString: (proj.tags || []).join(', ') 
    });
    else setForm({ title: '', category: 'Web', status: 'Active', desc: '', link: '', icon: 'fas fa-code', color: '#7c3aed', tagsString: '' });
  }, [proj]);

  const handleSave = () => {
    const projToSave: Project = { ...form };
    delete (projToSave as { tagsString?: string }).tagsString;
    projToSave.tags = (form.tagsString || '').split(',').map((t: string) => t.trim()).filter(Boolean);
    onSave(projToSave);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>{proj ? 'Edit Project' : 'Add Project'}</h3>
        {[
          ['Title', 'title', 'text'],
          ['GitHub Link', 'link', 'url'],
          ['Icon Class', 'icon', 'text'],
          ['Tags (comma separated)', 'tagsString', 'text'],
        ].map(([label, key, type]) => (
          <div className="form-row" key={key as string}>
            <label htmlFor={`proj-${key as string}`}>{label as string}</label>
            <input id={`proj-${key as string}`} type={type as string} value={String((form as Record<string, unknown>)[key as string] || '')} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label htmlFor="proj-cat">Category</label>
          <select id="proj-cat" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {['Web','Android','Bot','IoT','Desktop','Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="proj-status">Status</label>
          <select id="proj-status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Active','Completed','Archived'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="proj-color">Accent Color</label>
          <input id="proj-color" type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="admin-color-picker" />
        </div>
        <div className="form-row">
          <label htmlFor="proj-desc">Description</label>
          <textarea id="proj-desc" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} />
        </div>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Skill Modal ── */
function SkillModal({ skill, onSave, onClose }: { skill: Skill | null, onSave: (f: Skill) => void, onClose: () => void }) {
  const [form, setForm] = useState<Skill>({ label: '', icon: 'fas fa-code', level: 'Proficient', color: '#7c3aed' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (skill) setForm({ label: skill.label || '', icon: skill.icon || 'fas fa-code', level: skill.level || 'Proficient', color: skill.color || '#7c3aed' });
    else setForm({ label: '', icon: 'fas fa-code', level: 'Proficient', color: '#7c3aed' });
  }, [skill]);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-md">
        <h3>{skill ? 'Edit Skill' : 'Add Skill'}</h3>
        {[['Label','label','text'],['Icon Class','icon','text']].map(([l,k,t]) => (
          <div className="form-row" key={k as string}><label htmlFor={`skill-${k as string}`}>{l as string}</label><input id={`skill-${k as string}`} type={t as string} value={String((form as Record<string, unknown>)[k as string] || '')} onChange={e=>setForm(f=>({...f,[k as string]:e.target.value}))}/></div>
        ))}
        <div className="form-row">
          <label htmlFor="skill-lvl">Level</label>
          <select id="skill-lvl" value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
            {['Specialist','Expert','Advanced','Proficient','Learning'].map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="skill-color">Accent Color</label>
          <input id="skill-color" type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} className="admin-color-picker"/>
        </div>
        <div className="admin-modal-actions">
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={()=>onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════ */
export default function DashboardClient() {
  const { user, role, signOutUser } = useAuth();
  const router = useRouter();

  const [tab, setTab]         = useState('projects');
  const [projects, setProj]   = useState<Project[]>([]);
  const [skills, setSkills]   = useState<Skill[]>([]);
  const [experiences, setExps] = useState<Experience[]>([]);
  const [services, setServs]  = useState<Service[]>([]);
  const [testimonials, setTests] = useState<Testimonial[]>([]);
  const [messages, setMsgs]   = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [toast, setToast]     = useState<{msg: string, type: string} | null>(null);
  const [confirm, setConfirm] = useState<{msg: string, onConfirm: () => void} | null>(null);
  const [projModal, setProjModal] = useState<Project | null>(null);
  const [skillModal, setSkillModal] = useState<Skill | null>(null);
  const [expModal, setExpModal] = useState<Experience | null>(null);
  const [srvModal, setSrvModal] = useState<Service | null>(null);
  const [testModal, setTestModal] = useState<Testimonial | null>(null);

  const showToast = (msg: string, type = 'success') => setToast({ msg, type });

  /* Real-time listeners */
  useEffect(() => {
    const unsubs = [
      onSnapshot(query(collection(db,'projects'),orderBy('createdAt','desc')), s => setProj(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
      onSnapshot(query(collection(db,'skills'),orderBy('label')),              s => setSkills(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
      onSnapshot(query(collection(db,'experiences'),orderBy('order')),         s => setExps(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
      onSnapshot(query(collection(db,'services'),orderBy('order')),            s => setServs(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
      onSnapshot(query(collection(db,'testimonials'),orderBy('createdAt','desc')), s => setTests(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
      onSnapshot(query(collection(db,'contactMessages'),orderBy('createdAt','desc')), s => setMsgs(s.docs.map(d=>({id:d.id,...d.data()}))), ()=>{}),
    ];
    // Load settings
    getDoc(doc(db,'siteSettings','notifications')).then(d => d.exists() && setSettings(d.data())).catch(()=>{});
    return () => unsubs.forEach(u => u());
  }, []);

  /* Project CRUD */
  const saveProject = async (form: Project, id: string) => {
    try {
      if (id) await updateDoc(doc(db,'projects',id), { ...form, updatedAt: serverTimestamp() });
      else     await addDoc(collection(db,'projects'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Project updated' : 'Project added');
      setProjModal(null);
    } catch { showToast('Failed to save project','error'); }
  };

  const deleteProject = (id: string) => setConfirm({ msg: 'Delete this project?', onConfirm: async () => {
    await deleteDoc(doc(db,'projects',id)).catch(()=>{});
    showToast('Project deleted');
    setConfirm(null);
  }});

  /* Skill CRUD */
  const saveSkill = async (form: Skill, id: string) => {
    try {
      if (id) await updateDoc(doc(db,'skills',id), form);
      else     await addDoc(collection(db,'skills'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Skill updated' : 'Skill added');
      setSkillModal(null);
    } catch { showToast('Failed to save skill','error'); }
  };

  const deleteSkill = (id: string) => setConfirm({ msg: 'Delete this skill?', onConfirm: async () => {
    await deleteDoc(doc(db,'skills',id)).catch(()=>{});
    showToast('Skill deleted');
    setConfirm(null);
  }});

  /* Experience CRUD */
  const saveExp = async (form: Experience, id: string) => {
    try {
      if (id) await updateDoc(doc(db,'experiences',id), form);
      else     await addDoc(collection(db,'experiences'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Experience updated' : 'Experience added');
      setExpModal(null);
    } catch { showToast('Failed to save experience','error'); }
  };

  const deleteExp = (id: string) => setConfirm({ msg: 'Delete this experience?', onConfirm: async () => {
    await deleteDoc(doc(db,'experiences',id)).catch(()=>{});
    showToast('Experience deleted');
    setConfirm(null);
  }});

  /* Service CRUD */
  const saveSrv = async (form: Service, id: string) => {
    try {
      if (id) await updateDoc(doc(db,'services',id), form);
      else     await addDoc(collection(db,'services'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Service updated' : 'Service added');
      setSrvModal(null);
    } catch { showToast('Failed to save service','error'); }
  };

  const deleteSrv = (id: string) => setConfirm({ msg: 'Delete this service?', onConfirm: async () => {
    await deleteDoc(doc(db,'services',id)).catch(()=>{});
    showToast('Service deleted');
    setConfirm(null);
  }});

  /* Testimonial CRUD */
  const saveTest = async (form: Testimonial, id: string) => {
    try {
      if (id) await updateDoc(doc(db,'testimonials',id), form);
      else     await addDoc(collection(db,'testimonials'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Testimonial updated' : 'Testimonial added');
      setTestModal(null);
    } catch { showToast('Failed to save testimonial','error'); }
  };

  const deleteTest = (id: string) => setConfirm({ msg: 'Delete this testimonial?', onConfirm: async () => {
    await deleteDoc(doc(db,'testimonials',id)).catch(()=>{});
    showToast('Testimonial deleted');
    setConfirm(null);
  }});

  /* Message actions */
  const markRead = async (id: string) => { await updateDoc(doc(db,'contactMessages',id),{read:true}).catch(()=>{}); };
  const deleteMsg = (id: string) => setConfirm({ msg: 'Delete this message?', onConfirm: async () => {
    await deleteDoc(doc(db,'contactMessages',id)).catch(()=>{});
    showToast('Message deleted');
    setConfirm(null);
  }});

  /* Settings save */
  const saveSettings = async () => {
    try {
      await setDoc(doc(db,'siteSettings','notifications'), settings, { merge: true });
      showToast('Settings saved');
    } catch { showToast('Failed to save settings','error'); }
  };

  const initializeDefaultData = async () => {
    const defaultExps = [
      { role: 'System Architect & Founder', company: 'NovaMesh', period: '2023 - Present', desc: 'Developed NovaMesh Android, a system-level utility for advanced network and hotspot control. Achieved significant improvements in mobile data stability and latency.', order: 0 },
      { role: 'Lead Developer', company: 'SHANU-MD Bot', period: '2022 - Present', desc: 'Architected and maintained a multi-device WhatsApp bot with a plugin-based architecture, used by thousands for automation and group management.', order: 1 },
      { role: 'Full-Stack Developer', company: 'Freelance / Open Source', period: '2021 - Present', desc: 'Built various full-stack applications including NovaNetX VPN platform and NexusPOS. Specialized in React, Node.js, and Firebase.', order: 2 }
    ];
    const defaultSrvs = [
      { title: 'Android System Optimization', icon: 'fab fa-android', color: '#10b981', desc: 'Deep system-level modifications, custom ROM integrations, and performance tuning for Android devices to maximize battery life and responsiveness.', order: 0 },
      { title: 'Full-Stack Web Development', icon: 'fas fa-code', color: '#06b6d4', desc: 'End-to-end web applications using React, Node.js, and Firebase. Architecting scalable, responsive, and secure digital platforms.', order: 1 },
      { title: 'Automation & Bot Development', icon: 'fas fa-robot', color: '#7c3aed', desc: 'Intelligent automation tools and multi-device WhatsApp bots with rich features, plugin systems, and administrative controls.', order: 2 },
      { title: 'IoT & Hardware Integration', icon: 'fas fa-microchip', color: '#f472b6', desc: 'Developing smart hardware solutions using ESP8266/ESP32, C++, and IoT cloud platforms like Blynk for real-time monitoring and control.', order: 3 }
    ];
    const defaultTests = [
      { name: 'Alex Mercer', role: 'Tech Lead at CyberNova', text: 'SHANUTECHX completely revolutionized our mobile networking stack. NovaMesh provided stability we didn\'t think was possible on standard consumer hardware. Exceptional talent.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
      { name: 'Sarah Chen', role: 'Community Manager', text: 'The SHANU-MD WhatsApp bot saved us hundreds of hours in moderation and content management. The plugin system makes it incredibly flexible for our evolving needs.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { name: 'Dr. Ramesh Kumar', role: 'Research Director', text: 'For a 17-year-old, his grasp on system architecture and IoT integration is simply staggering. The smart plant care system he built was flawless and intuitive.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' }
    ];

    try {
      showToast('Initializing data...', 'info');
      for (const exp of defaultExps) await addDoc(collection(db, 'experiences'), { ...exp, createdAt: serverTimestamp() });
      for (const srv of defaultSrvs) await addDoc(collection(db, 'services'), { ...srv, createdAt: serverTimestamp() });
      for (const tst of defaultTests) await addDoc(collection(db, 'testimonials'), { ...tst, createdAt: serverTimestamp() });
      showToast('Data initialized successfully!');
    } catch (e) {
      console.error(e);
      showToast('Failed to initialize data', 'error');
    }
  };

  const handleLogout = async () => { await signOutUser(); router.push('/admin'); };

  const TABS = [
    { key:'projects',    label:'Projects',    icon:'fas fa-rocket',   count: projects.length },
    { key:'skills',      label:'Skills',      icon:'fas fa-code',     count: skills.length },
    { key:'experiences', label:'Timeline',    icon:'fas fa-history',  count: experiences.length },
    { key:'services',    label:'Services',    icon:'fas fa-concierge-bell', count: services.length },
    { key:'testimonials', label:'Testimonials', icon:'fas fa-comment-dots', count: testimonials.length },
    { key:'messages',    label:'Messages',    icon:'fas fa-envelope', count: messages.filter(m=>!m.read).length },
    { key:'settings',    label:'Settings',    icon:'fas fa-cog',      count: 0 },
  ];

  return (
    <div className="admin-layout">
      {/* Nav */}
      <nav className="admin-nav">
        <div className="admin-flex-row">
          <Link href="/" className="admin-brand">Shanu<span>TechX</span></Link>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-nav-right">
          <span className="admin-email">{user?.email}</span>
          {user?.photoURL && <Image className="admin-avatar-img" src={user.photoURL} alt="Admin" width={32} height={32} onError={e=>(e.target as HTMLImageElement).style.display='none'} />}
          <Link href="/" className="btn-admin btn-admin-outline admin-nav-btn-sm">
            <i className="fas fa-external-link-alt" /> Site
          </Link>
          <button onClick={handleLogout} className="btn-admin btn-admin-danger admin-nav-logout">
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>
      </nav>

      <div className="admin-main">
        {/* Welcome */}
        <div className="admin-welcome-header">
          <div>
            <h1 className="admin-welcome-title">
              Welcome back, {user?.displayName?.split(' ')[0]} 👋
            </h1>
            <p className="admin-date-text">
              {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
          <span className="admin-badge admin-badge-lg">
            {role === 'primary' ? '⭐ Primary Admin' : '🛡️ Admin'}
          </span>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label:'Projects', val: projects.length, icon:'fas fa-rocket', color:'#7c3aed' },
            { label:'Skills',   val: skills.length,   icon:'fas fa-code',   color:'#06b6d4' },
            { label:'Messages', val: messages.length, icon:'fas fa-envelope',color:'#f472b6', sub: messages.filter(m=>!m.read).length + ' unread' },
            { label:'Status',   val: 'Live',          icon:'fas fa-circle', color:'#10b981' },
          ].map(s => (
            <motion.div className="stat-card" key={s.label} style={{ '--_accent': s.color } as React.CSSProperties}>
              <i className={`${s.icon} admin-stat-icon`} />
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
              {s.sub && <div className="admin-stat-sub">{s.sub}</div>}
            </motion.div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${tab===t.key?' active':''}`} onClick={()=>setTab(t.key)}>
              <i className={t.icon} />
              {t.label}
              {t.count > 0 && <span className="admin-tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">Projects ({projects.length})</span>
              <button className="btn-admin btn-admin-primary" onClick={()=>setProjModal({})}>
                <i className="fas fa-plus" /> Add Project
              </button>
            </div>
            <div className="admin-overflow-x">
              <table className="admin-table">
                <thead>
                  <tr><th>Title</th><th>Category</th><th>Status</th><th>Tags</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {projects.length === 0 && (
                    <tr><td colSpan={5} className="admin-td-empty">No projects yet. Add one!</td></tr>
                  )}
                  {projects.map(p => (
                    <motion.tr key={p.id} style={{ '--_accent': p.color||'#7c3aed' } as React.CSSProperties}>
                      <td className="admin-td-title">
                        <i className={`${p.icon||'fas fa-code'} admin-td-icon`} />
                        {p.title}
                      </td>
                      <td><span className="admin-category-badge">{p.category}</span></td>
                      <td><span className={`admin-status-text ${p.status==='Active'?'admin-status-active':'admin-status-inactive'}`}>{p.status||'—'}</span></td>
                      <td className="admin-td-tags">{(p.tags||[]).slice(0,3).join(', ')}</td>
                      <td>
                        <div className="admin-actions-table">
                          <button aria-label="Edit project" className="btn-admin btn-admin-outline admin-btn-sm" onClick={()=>setProjModal(p)}><i className="fas fa-edit" /></button>
                          <button aria-label="Delete project" className="btn-admin btn-admin-danger admin-btn-sm" onClick={()=>deleteProject(p.id!)}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {tab === 'skills' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">Skills ({skills.length})</span>
              <button className="btn-admin btn-admin-primary" onClick={()=>setSkillModal({})}>
                <i className="fas fa-plus" /> Add Skill
              </button>
            </div>
            <div className="admin-grid-skills">
              {skills.length === 0 && (
                <p className="admin-empty-state">No skills yet.</p>
              )}
              {skills.map(s => (
                <motion.div key={s.id} className="admin-list-item" style={{ '--_accent': s.color||'#7c3aed', '--_accent-bg': `${s.color||'#7c3aed'}18` } as React.CSSProperties}>
                  <div className="admin-icon-box">
                    <i className={s.icon||'fas fa-code'} />
                  </div>
                  <div className="admin-flex-1">
                    <div className="admin-skill-title">{s.label}</div>
                    <div className="admin-skill-level">{s.level}</div>
                  </div>
                  <div className="admin-actions">
                    <button aria-label="Edit skill" className="btn-admin btn-admin-outline admin-btn-xs" onClick={()=>setSkillModal(s)}><i className="fas fa-edit" /></button>
                    <button aria-label="Delete skill" className="btn-admin btn-admin-danger admin-btn-xs" onClick={()=>deleteSkill(s.id!)}><i className="fas fa-trash" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE TAB ── */}
        {tab === 'experiences' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">Timeline Experience ({experiences.length})</span>
              <button className="btn-admin btn-admin-primary" onClick={()=>setExpModal({})}>
                <i className="fas fa-plus" /> Add Experience
              </button>
            </div>
            <div className="admin-pad">
              {experiences.length === 0 && <p className="admin-empty-state">No experience entries yet.</p>}
              <div className="admin-flex-col-gap">
                {experiences.map(e => (
                  <div key={e.id} className="admin-list-item-large">
                    <div className="admin-flex-between admin-mb-1">
                      <div>
                        <div className="admin-text-title">{e.role}</div>
                        <div className="admin-text-subtitle">{e.company} | {e.period}</div>
                      </div>
                      <div className="admin-actions">
                        <button aria-label="Edit experience" className="btn-admin btn-admin-outline" onClick={()=>setExpModal(e)}><i className="fas fa-edit" /></button>
                        <button aria-label="Delete experience" className="btn-admin btn-admin-danger" onClick={()=>deleteExp(e.id!)}><i className="fas fa-trash" /></button>
                      </div>
                    </div>
                    <p className="admin-text-desc">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {tab === 'services' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">What I Do Services ({services.length})</span>
              <button className="btn-admin btn-admin-primary" onClick={()=>setSrvModal({})}>
                <i className="fas fa-plus" /> Add Service
              </button>
            </div>
            <div className="admin-grid-services">
              {services.length === 0 && <p className="admin-empty-state">No services yet.</p>}
              {services.map(s => (
                <motion.div key={s.id} className="admin-list-item-large" style={{ '--_accent': s.color, '--_accent-bg': `${s.color}18` } as React.CSSProperties}>
                  <div className="admin-flex-row admin-mb-1r">
                    <div className="admin-icon-box-large">
                      <i className={s.icon} />
                    </div>
                    <div className="admin-text-title admin-flex-1">{s.title}</div>
                    <div className="admin-actions">
                      <button aria-label="Edit service" className="btn-admin btn-admin-outline admin-btn-xs" onClick={()=>setSrvModal(s)}><i className="fas fa-edit" /></button>
                      <button aria-label="Delete service" className="btn-admin btn-admin-danger admin-btn-xs" onClick={()=>deleteSrv(s.id!)}><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                  <p className="admin-text-desc">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS TAB ── */}
        {tab === 'testimonials' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">Feedback ({testimonials.length})</span>
              <button className="btn-admin btn-admin-primary" onClick={()=>setTestModal({})}>
                <i className="fas fa-plus" /> Add Testimonial
              </button>
            </div>
            <div className="admin-grid-testimonials">
              {testimonials.length === 0 && <p className="admin-empty-state">No testimonials yet.</p>}
              {testimonials.map(t => (
                <div key={t.id} className="admin-list-item-large">
                  <div className="admin-flex-row admin-mb-1r">
                    <Image src={t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || '')}&background=7c3aed&color=fff`} alt={t.name || 'Avatar'} width={42} height={42} className="admin-avatar-img" />
                    <div className="admin-flex-1">
                      <div className="admin-text-title admin-test-title">{t.name}</div>
                      <div className="admin-text-subtitle admin-test-role">{t.role}</div>
                    </div>
                    <div className="admin-actions">
                      <button aria-label="Edit testimonial" className="btn-admin btn-admin-outline admin-btn-xs" onClick={()=>setTestModal(t)}><i className="fas fa-edit" /></button>
                      <button aria-label="Delete testimonial" className="btn-admin btn-admin-danger admin-btn-xs" onClick={()=>deleteTest(t.id!)}><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                  <p className="admin-text-desc admin-text-italic">&quot;{t.text}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div>
            <div className="admin-msg-header">
              <span className="admin-msg-title">Messages ({messages.length})</span>
              <span className="admin-msg-count">{messages.filter(m=>!m.read).length} unread</span>
            </div>
            {messages.length === 0 && (
              <div className="showcase-empty">No messages yet.</div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`msg-card${!m.read?' unread':''}`} onClick={()=>markRead(m.id)}>
                <div className="admin-flex-between">
                  <div>
                    <div className="msg-name">{m.name} {!m.read && <span className="admin-new-badge">NEW</span>}</div>
                    <div className="msg-email">{m.email}</div>
                  </div>
                  <button aria-label="Delete message" className="btn-admin btn-admin-danger admin-btn-xs" onClick={e=>{e.stopPropagation();deleteMsg(m.id);}}>
                    <i className="fas fa-trash" />
                  </button>
                </div>
                <p className="msg-text">{m.message}</p>
                <div className="msg-time">{m.createdAt?.toDate?.()?.toLocaleString() || '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span className="admin-section-title">Site Settings</span>
              <button className="btn-admin btn-admin-primary" onClick={saveSettings}>
                <i className="fas fa-save" /> Save Changes
              </button>
            </div>
            <div className="admin-pad-lg">
              <div className="admin-setting-group">
                <label htmlFor="settings-discord" className="admin-settings-label">Discord Webhook URL</label>
                <p className="admin-setting-hint">For contact form notification alerts</p>
                <input
                  id="settings-discord"
                  type="url"
                  className="admin-settings-input"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={settings.discordWebhook || ''}
                  onChange={e=>setSettings((s: SiteSettings)=>({...s,discordWebhook:e.target.value}))}
                />
              </div>
              <div className="admin-setting-group">
                <label htmlFor="settings-title" className="admin-settings-label">Site Title</label>
                <input
                  id="settings-title"
                  type="text"
                  className="admin-settings-input admin-setting-title-input"
                  placeholder="SHANUTECHX Portfolio"
                  value={settings.siteTitle || ''}
                  onChange={e=>setSettings((s: SiteSettings)=>({...s,siteTitle:e.target.value}))}
                />
              </div>
              <div>
                <label className="form-label">Maintenance Mode</label>
                <div className="admin-settings-maint-wrap">
                  <label className="toggle-switch">
                    <input type="checkbox" aria-label="Toggle maintenance mode" checked={!!settings.maintenance} onChange={e=>setSettings((s: SiteSettings)=>({...s,maintenance:e.target.checked}))} />
                    <span className="toggle-slider" />
                  </label>
                  <span className="admin-settings-maint-text">{settings.maintenance ? 'Site in maintenance mode' : 'Site is live'}</span>
                </div>
              </div>

              <div className="admin-settings-section">
                <h4 className="admin-settings-h4 admin-settings-h4-primary">📦 Data Initialization</h4>
                <p className="admin-settings-p">Click below to populate Experience and Services with your current data.</p>
                <button className="btn-admin btn-admin-outline admin-init-btn" onClick={initializeDefaultData}>
                  <i className="fas fa-database" /> Initialize Default Data
                </button>
              </div>

              {role === 'primary' && (
                <div className="admin-settings-section">
                  <h4 className="admin-settings-h4 admin-settings-h4-danger">⚠️ Danger Zone</h4>
                  <p className="admin-settings-p">These actions affect the entire site.</p>
                  <button className="btn-admin btn-admin-danger" onClick={()=>showToast('Feature coming soon','error')}>
                    <i className="fas fa-database" /> Export All Data
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {projModal  && <ProjectModal proj={projModal.id ? projModal : null} onSave={(f: Project)=>saveProject(f,projModal.id!)} onClose={()=>setProjModal(null)} />}
      {skillModal && <SkillModal  skill={skillModal.id ? skillModal : null} onSave={(f: Skill)=>saveSkill(f,skillModal.id!)} onClose={()=>setSkillModal(null)} />}
      {expModal   && <ExperienceModal exp={expModal.id ? expModal : null} onSave={(f: Experience)=>saveExp(f,expModal.id!)} onClose={()=>setExpModal(null)} />}
      {srvModal   && <ServiceModal srv={srvModal.id ? srvModal : null} onSave={(f: Service)=>saveSrv(f,srvModal.id!)} onClose={()=>setSrvModal(null)} />}
      {testModal  && <TestimonialModal test={testModal.id ? testModal : null} onSave={(f: Testimonial)=>saveTest(f,testModal.id!)} onClose={()=>setTestModal(null)} />}
      {confirm    && <ConfirmModal msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}
      {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}
