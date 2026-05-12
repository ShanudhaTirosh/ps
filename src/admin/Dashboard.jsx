import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, getDoc, setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

/* ── Toast ── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

/* ── Confirm Modal ── */
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: 360 }}>
        <h3 style={{ color: '#f43f5e' }}><i className="fas fa-exclamation-triangle" /> Confirm Delete</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{msg}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn-admin btn-admin-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-admin btn-admin-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Experience Modal ── */
function ExperienceModal({ exp, onSave, onClose }) {
  const [form, setForm] = useState({ role: '', company: '', period: '', desc: '', order: 0 });

  useEffect(() => {
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
          <div className="form-row" key={key}>
            <label>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label>Description</label>
          <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={4} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Service Modal ── */
function ServiceModal({ srv, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', icon: 'fas fa-code', color: '#7c3aed', desc: '', order: 0 });

  useEffect(() => {
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
          <div className="form-row" key={key}>
            <label>{label}</label>
            <input 
              type={type} 
              value={form[key]} 
              onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value }))}
              style={type === 'color' ? { width: 60, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' } : {}}
            />
          </div>
        ))}
        <div className="form-row">
          <label>Description</label>
          <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={4} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Testimonial Modal ── */
function TestimonialModal({ test, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', role: '', text: '', avatar: '' });

  useEffect(() => {
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
          <div className="form-row" key={key}>
            <label>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label>Feedback Text</label>
          <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Project Modal ── */
function ProjectModal({ proj, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', category: 'Web', status: 'Active', desc: '',
    link: '', icon: 'fas fa-code', color: '#7c3aed', tags: '',
  });

  useEffect(() => {
    if (proj) setForm({ 
      title: proj.title || '', category: proj.category || 'Web', status: proj.status || 'Active', 
      desc: proj.desc || '', link: proj.link || '', icon: proj.icon || 'fas fa-code', 
      color: proj.color || '#7c3aed', tags: (proj.tags || []).join(', ') 
    });
    else setForm({ title: '', category: 'Web', status: 'Active', desc: '', link: '', icon: 'fas fa-code', color: '#7c3aed', tags: '' });
  }, [proj]);

  const handleSave = () => {
    onSave({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3>{proj ? 'Edit Project' : 'Add Project'}</h3>
        {[
          ['Title', 'title', 'text'],
          ['GitHub Link', 'link', 'url'],
          ['Icon Class', 'icon', 'text'],
          ['Tags (comma separated)', 'tags', 'text'],
        ].map(([label, key, type]) => (
          <div className="form-row" key={key}>
            <label>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}
        <div className="form-row">
          <label>Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {['Web','Android','Bot','IoT','Desktop','Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Active','Completed','Archived'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Accent Color</label>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 60, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }} />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn-admin btn-admin-outline" onClick={onClose}>Cancel</button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Skill Modal ── */
function SkillModal({ skill, onSave, onClose }) {
  const [form, setForm] = useState({ label: '', icon: 'fas fa-code', level: 'Proficient', color: '#7c3aed' });

  useEffect(() => {
    if (skill) setForm({ label: skill.label || '', icon: skill.icon || 'fas fa-code', level: skill.level || 'Proficient', color: skill.color || '#7c3aed' });
    else setForm({ label: '', icon: 'fas fa-code', level: 'Proficient', color: '#7c3aed' });
  }, [skill]);

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: 400 }}>
        <h3>{skill ? 'Edit Skill' : 'Add Skill'}</h3>
        {[['Label','label','text'],['Icon Class','icon','text']].map(([l,k,t]) => (
          <div className="form-row" key={k}><label>{l}</label><input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/></div>
        ))}
        <div className="form-row">
          <label>Level</label>
          <select value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
            {['Specialist','Expert','Advanced','Proficient','Learning'].map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Accent Color</label>
          <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{width:60,height:36,borderRadius:8,border:'none',cursor:'pointer',background:'none'}}/>
        </div>
        <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end',marginTop:'1rem'}}>
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
export default function Dashboard() {
  const { user, role, signOutUser } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]         = useState('projects');
  const [projects, setProj]   = useState([]);
  const [skills, setSkills]   = useState([]);
  const [experiences, setExps] = useState([]);
  const [services, setServs]  = useState([]);
  const [testimonials, setTests] = useState([]);
  const [messages, setMsgs]   = useState([]);
  const [settings, setSettings] = useState({});
  const [toast, setToast]     = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [projModal, setProjModal] = useState(null);
  const [skillModal, setSkillModal] = useState(null);
  const [expModal, setExpModal] = useState(null);
  const [srvModal, setSrvModal] = useState(null);
  const [testModal, setTestModal] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

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
  const saveProject = async (form, id) => {
    try {
      if (id) await updateDoc(doc(db,'projects',id), { ...form, updatedAt: serverTimestamp() });
      else     await addDoc(collection(db,'projects'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Project updated' : 'Project added');
      setProjModal(null);
    } catch { showToast('Failed to save project','error'); }
  };

  const deleteProject = (id) => setConfirm({ msg: 'Delete this project?', onConfirm: async () => {
    await deleteDoc(doc(db,'projects',id)).catch(()=>{});
    showToast('Project deleted');
    setConfirm(null);
  }});

  /* Skill CRUD */
  const saveSkill = async (form, id) => {
    try {
      if (id) await updateDoc(doc(db,'skills',id), form);
      else     await addDoc(collection(db,'skills'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Skill updated' : 'Skill added');
      setSkillModal(null);
    } catch { showToast('Failed to save skill','error'); }
  };

  const deleteSkill = (id) => setConfirm({ msg: 'Delete this skill?', onConfirm: async () => {
    await deleteDoc(doc(db,'skills',id)).catch(()=>{});
    showToast('Skill deleted');
    setConfirm(null);
  }});

  /* Experience CRUD */
  const saveExp = async (form, id) => {
    try {
      if (id) await updateDoc(doc(db,'experiences',id), form);
      else     await addDoc(collection(db,'experiences'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Experience updated' : 'Experience added');
      setExpModal(null);
    } catch { showToast('Failed to save experience','error'); }
  };

  const deleteExp = (id) => setConfirm({ msg: 'Delete this experience?', onConfirm: async () => {
    await deleteDoc(doc(db,'experiences',id)).catch(()=>{});
    showToast('Experience deleted');
    setConfirm(null);
  }});

  /* Service CRUD */
  const saveSrv = async (form, id) => {
    try {
      if (id) await updateDoc(doc(db,'services',id), form);
      else     await addDoc(collection(db,'services'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Service updated' : 'Service added');
      setSrvModal(null);
    } catch { showToast('Failed to save service','error'); }
  };

  const deleteSrv = (id) => setConfirm({ msg: 'Delete this service?', onConfirm: async () => {
    await deleteDoc(doc(db,'services',id)).catch(()=>{});
    showToast('Service deleted');
    setConfirm(null);
  }});

  /* Testimonial CRUD */
  const saveTest = async (form, id) => {
    try {
      if (id) await updateDoc(doc(db,'testimonials',id), form);
      else     await addDoc(collection(db,'testimonials'), { ...form, createdAt: serverTimestamp() });
      showToast(id ? 'Testimonial updated' : 'Testimonial added');
      setTestModal(null);
    } catch { showToast('Failed to save testimonial','error'); }
  };

  const deleteTest = (id) => setConfirm({ msg: 'Delete this testimonial?', onConfirm: async () => {
    await deleteDoc(doc(db,'testimonials',id)).catch(()=>{});
    showToast('Testimonial deleted');
    setConfirm(null);
  }});

  /* Message actions */
  const markRead = async (id) => { await updateDoc(doc(db,'contactMessages',id),{read:true}).catch(()=>{}); };
  const deleteMsg = (id) => setConfirm({ msg: 'Delete this message?', onConfirm: async () => {
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
      { name: 'Alex Mercer', role: 'Tech Lead at CyberNova', text: 'ShanuFx completely revolutionized our mobile networking stack. NovaMesh provided stability we didn\'t think was possible on standard consumer hardware. Exceptional talent.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
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

  const handleLogout = async () => { await signOutUser(); navigate('/admin'); };

  const TABS = [
    { key:'projects',    label:'Projects',    icon:'fas fa-rocket',   count: projects.length },
    { key:'skills',      label:'Skills',      icon:'fas fa-code',     count: skills.length },
    { key:'experiences', label:'Timeline',    icon:'fas fa-history',  count: experiences.length },
    { key:'services',    label:'Services',    icon:'fas fa-concierge-bell', count: services.length },
    { key:'testimonials', label:'Testimonials', icon:'fas fa-comment-dots', count: testimonials.length },
    { key:'messages',    label:'Messages',    icon:'fas fa-envelope', count: messages.filter(m=>!m.read).length },
    { key:'settings',    label:'Settings',    icon:'fas fa-cog' },
  ];

  return (
    <div className="admin-layout">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* Nav */}
      <nav className="admin-nav">
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <Link to="/" className="admin-brand">Shanu<span>Fx</span></Link>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-nav-right">
          <span className="admin-email">{user?.email}</span>
          <img className="admin-avatar" src={user?.photoURL || ''} alt="Admin" onError={e=>e.target.style.display='none'} />
          <Link to="/" style={{ fontSize:'0.78rem', color:'#4b5563', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.3rem' }}>
            <i className="fas fa-external-link-alt" /> Site
          </Link>
          <button onClick={handleLogout} style={{ background:'none', border:'1px solid rgba(244,63,94,0.3)', borderRadius:8, color:'#f43f5e', padding:'0.35rem 0.75rem', fontSize:'0.75rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontFamily:'inherit' }}>
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>
      </nav>

      <div className="admin-main">
        {/* Welcome */}
        <div style={{ marginBottom:'1.75rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', color:'#f1f0f7', marginBottom:'0.25rem' }}>
              Welcome back, {user?.displayName?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.72rem', color:'#4b5563' }}>
              {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
          <span className="admin-badge" style={{ fontSize:'0.7rem' }}>
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
            <div className="stat-card" key={s.label}>
              <i className={s.icon} style={{ color: s.color, opacity: 0.4, fontSize:'1.1rem', marginBottom:'0.5rem', display:'block' }} />
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
              {s.sub && <div style={{ fontSize:'0.65rem', color:'#f472b6', marginTop:'0.2rem' }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${tab===t.key?' active':''}`} onClick={()=>setTab(t.key)}>
              <i className={t.icon} />
              {t.label}
              {t.count > 0 && <span style={{ background:'rgba(124,58,237,0.2)', color:'#a855f7', borderRadius:50, padding:'0 0.4rem', fontSize:'0.65rem', fontWeight:700 }}>{t.count}</span>}
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
            <div style={{ overflowX:'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Title</th><th>Category</th><th>Status</th><th>Tags</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {projects.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace', fontSize:'0.8rem' }}>No projects yet. Add one!</td></tr>
                  )}
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td style={{ color:'#f1f0f7', fontWeight:600 }}>
                        <i className={p.icon||'fas fa-code'} style={{ color:p.color||'#7c3aed', marginRight:'0.5rem' }} />
                        {p.title}
                      </td>
                      <td><span style={{ background:'rgba(124,58,237,0.1)', color:'#a855f7', padding:'0.15rem 0.6rem', borderRadius:50, fontSize:'0.7rem', fontFamily:'JetBrains Mono,monospace' }}>{p.category}</span></td>
                      <td><span style={{ color: p.status==='Active'?'#34d399':'#4b5563', fontSize:'0.75rem', fontFamily:'JetBrains Mono,monospace' }}>{p.status||'—'}</span></td>
                      <td style={{ fontSize:'0.72rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace' }}>{(p.tags||[]).slice(0,3).join(', ')}</td>
                      <td>
                        <div style={{ display:'flex', gap:'0.4rem' }}>
                          <button className="btn-admin btn-admin-outline" onClick={()=>setProjModal(p)} style={{ padding:'0.3rem 0.65rem' }}><i className="fas fa-edit" /></button>
                          <button className="btn-admin btn-admin-danger" onClick={()=>deleteProject(p.id)} style={{ padding:'0.3rem 0.65rem' }}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem', padding:'1.25rem' }}>
              {skills.length === 0 && (
                <p style={{ color:'#4b5563', fontFamily:'JetBrains Mono,monospace', fontSize:'0.8rem', gridColumn:'1/-1', textAlign:'center', padding:'2rem' }}>No skills yet.</p>
              )}
              {skills.map(s => (
                <div key={s.id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${s.color||'#7c3aed'}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <i className={s.icon||'fas fa-code'} style={{ color:s.color||'#7c3aed' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:'#f1f0f7', fontWeight:600, fontSize:'0.85rem' }}>{s.label}</div>
                    <div style={{ color:'#4b5563', fontSize:'0.7rem', fontFamily:'JetBrains Mono,monospace' }}>{s.level}</div>
                  </div>
                  <div style={{ display:'flex', gap:'0.35rem' }}>
                    <button className="btn-admin btn-admin-outline" onClick={()=>setSkillModal(s)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-edit" /></button>
                    <button className="btn-admin btn-admin-danger" onClick={()=>deleteSkill(s.id)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-trash" /></button>
                  </div>
                </div>
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
            <div style={{ padding:'1.25rem' }}>
              {experiences.length === 0 && <p style={{ color:'#4b5563', textAlign:'center', padding:'2rem' }}>No experience entries yet.</p>}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {experiences.map(e => (
                  <div key={e.id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                      <div>
                        <div style={{ color:'#f1f0f7', fontWeight:700, fontSize:'1rem' }}>{e.role}</div>
                        <div style={{ color:'#a855f7', fontSize:'0.85rem' }}>{e.company} | {e.period}</div>
                      </div>
                      <div style={{ display:'flex', gap:'0.4rem' }}>
                        <button className="btn-admin btn-admin-outline" onClick={()=>setExpModal(e)}><i className="fas fa-edit" /></button>
                        <button className="btn-admin btn-admin-danger" onClick={()=>deleteExp(e.id)}><i className="fas fa-trash" /></button>
                      </div>
                    </div>
                    <p style={{ color:'#94a3b8', fontSize:'0.82rem', lineHeight:1.6, margin:0 }}>{e.desc}</p>
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem', padding:'1.25rem' }}>
              {services.length === 0 && <p style={{ color:'#4b5563', textAlign:'center', gridColumn:'1/-1', padding:'2rem' }}>No services yet.</p>}
              {services.map(s => (
                <div key={s.id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <i className={s.icon} style={{ color:s.color }} />
                    </div>
                    <div style={{ flex:1, color:'#f1f0f7', fontWeight:700 }}>{s.title}</div>
                    <div style={{ display:'flex', gap:'0.35rem' }}>
                      <button className="btn-admin btn-admin-outline" onClick={()=>setSrvModal(s)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-edit" /></button>
                      <button className="btn-admin btn-admin-danger" onClick={()=>deleteSrv(s.id)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                  <p style={{ color:'#94a3b8', fontSize:'0.8rem', lineHeight:1.5, margin:0 }}>{s.desc}</p>
                </div>
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem', padding:'1.25rem' }}>
              {testimonials.length === 0 && <p style={{ color:'#4b5563', textAlign:'center', gridColumn:'1/-1', padding:'2rem' }}>No testimonials yet.</p>}
              {testimonials.map(t => (
                <div key={t.id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                    <img src={t.avatar} alt={t.name} style={{ width:42, height:42, borderRadius:'50%', objectFit:'cover' }} />
                    <div style={{ flex:1 }}>
                      <div style={{ color:'#f1f0f7', fontWeight:700, fontSize:'0.9rem' }}>{t.name}</div>
                      <div style={{ color:'#a855f7', fontSize:'0.75rem' }}>{t.role}</div>
                    </div>
                    <div style={{ display:'flex', gap:'0.35rem' }}>
                      <button className="btn-admin btn-admin-outline" onClick={()=>setTestModal(t)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-edit" /></button>
                      <button className="btn-admin btn-admin-danger" onClick={()=>deleteTest(t.id)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}><i className="fas fa-trash" /></button>
                    </div>
                  </div>
                  <p style={{ color:'#94a3b8', fontSize:'0.82rem', lineHeight:1.6, margin:0, fontStyle:'italic' }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <span style={{ fontFamily:'Syne,sans-serif', color:'#f1f0f7', fontWeight:700 }}>Messages ({messages.length})</span>
              <span style={{ fontSize:'0.75rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace' }}>{messages.filter(m=>!m.read).length} unread</span>
            </div>
            {messages.length === 0 && (
              <div style={{ textAlign:'center', padding:'4rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace', fontSize:'0.82rem' }}>No messages yet.</div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`msg-card${!m.read?' unread':''}`} onClick={()=>markRead(m.id)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div className="msg-name">{m.name} {!m.read && <span style={{ fontSize:'0.6rem', background:'rgba(124,58,237,0.2)', color:'#a855f7', padding:'0.1rem 0.4rem', borderRadius:50, fontFamily:'JetBrains Mono,monospace', marginLeft:'0.4rem' }}>NEW</span>}</div>
                    <div className="msg-email">{m.email}</div>
                  </div>
                  <button className="btn-admin btn-admin-danger" onClick={e=>{e.stopPropagation();deleteMsg(m.id);}} style={{ padding:'0.25rem 0.5rem', fontSize:'0.7rem' }}>
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
            <div style={{ padding:'1.5rem' }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', fontSize:'0.72rem', color:'#4b5563', marginBottom:'0.4rem', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'0.05em' }}>Discord Webhook URL</label>
                <p style={{ fontSize:'0.72rem', color:'#4b5563', marginBottom:'0.5rem', fontFamily:'JetBrains Mono,monospace' }}>For contact form notification alerts</p>
                <input
                  type="url"
                  style={{ width:'100%', padding:'0.65rem 0.9rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f1f0f7', fontFamily:'JetBrains Mono,monospace', fontSize:'0.82rem', outline:'none' }}
                  placeholder="https://discord.com/api/webhooks/..."
                  value={settings.discordWebhook || ''}
                  onChange={e=>setSettings(s=>({...s,discordWebhook:e.target.value}))}
                />
              </div>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', fontSize:'0.72rem', color:'#4b5563', marginBottom:'0.4rem', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'0.05em' }}>Site Title</label>
                <input
                  type="text"
                  style={{ width:'100%', padding:'0.65rem 0.9rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f1f0f7', fontFamily:'inherit', fontSize:'0.85rem', outline:'none' }}
                  placeholder="ShanuFx Portfolio"
                  value={settings.siteTitle || ''}
                  onChange={e=>setSettings(s=>({...s,siteTitle:e.target.value}))}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'0.72rem', color:'#4b5563', marginBottom:'0.4rem', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'0.05em' }}>Maintenance Mode</label>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={!!settings.maintenance} onChange={e=>setSettings(s=>({...s,maintenance:e.target.checked}))} />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize:'0.82rem', color:'#94a3b8' }}>{settings.maintenance ? 'Site in maintenance mode' : 'Site is live'}</span>
                </div>
              </div>

              <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontFamily:'Syne,sans-serif', color:'#7c3aed', marginBottom:'0.5rem', fontSize:'0.9rem' }}>📦 Data Initialization</h4>
                <p style={{ fontSize:'0.78rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace', marginBottom:'1rem' }}>Click below to populate Experience and Services with your current data.</p>
                <button className="btn-admin btn-admin-outline" onClick={initializeDefaultData} style={{ borderColor:'rgba(124,58,237,0.3)', color:'#a855f7' }}>
                  <i className="fas fa-database" /> Initialize Default Data
                </button>
              </div>

              {role === 'primary' && (
                <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontFamily:'Syne,sans-serif', color:'#f43f5e', marginBottom:'0.5rem', fontSize:'0.9rem' }}>⚠️ Danger Zone</h4>
                  <p style={{ fontSize:'0.78rem', color:'#4b5563', fontFamily:'JetBrains Mono,monospace', marginBottom:'1rem' }}>These actions affect the entire site.</p>
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
      {projModal  && <ProjectModal proj={projModal.id ? projModal : null} onSave={f=>saveProject(f,projModal.id)} onClose={()=>setProjModal(null)} />}
      {skillModal && <SkillModal  skill={skillModal.id ? skillModal : null} onSave={f=>saveSkill(f,skillModal.id)} onClose={()=>setSkillModal(null)} />}
      {expModal   && <ExperienceModal exp={expModal.id ? expModal : null} onSave={f=>saveExp(f,expModal.id)} onClose={()=>setExpModal(null)} />}
      {srvModal   && <ServiceModal srv={srvModal.id ? srvModal : null} onSave={f=>saveSrv(f,srvModal.id)} onClose={()=>setSrvModal(null)} />}
      {testModal  && <TestimonialModal test={testModal.id ? testModal : null} onSave={f=>saveTest(f,testModal.id)} onClose={()=>setTestModal(null)} />}
      {confirm    && <ConfirmModal msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}
      {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}
