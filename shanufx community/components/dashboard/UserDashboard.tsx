'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { usePosts } from '@/lib/hooks/usePosts';
import { AvatarImg } from '../layout/Navbar';
import PostCard from '../community/PostCard';
import { useRouter } from 'next/navigation';
import { createChannel, updateProfile } from '@/lib/hooks/usePosts';
import { processImage } from '@/lib/utils/image';

export default function UserDashboard({ tab }: { tab?: string }) {
  const { user, signOut, refreshUser } = useAuth();
  const { notify } = useUI();
  const { posts } = usePosts();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [bio, setBio] = useState(user?.bio || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Create channel state
  const [newChName, setNewChName] = useState('');
  const [newChIcon, setNewChIcon] = useState('fa-volume-up');
  const [newChColor, setNewChColor] = useState('#7c3aed');
  const [newChPass, setNewChPass] = useState('');
  const [creating, setCreating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeBanner, setActiveBanner] = useState(user?.bannerAnimation || '');
  const [activeEffect, setActiveEffect] = useState(user?.profileEffect || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please upload an image file', 'error');
      return;
    }

    setUploading(true);
    try {
      const base64 = await processImage(file, 256, 256);
      await updateProfile(user.uid, { photoURL: base64 });
      notify('Avatar updated!', 'success');
    } catch (err) {
      console.error(err);
      notify('Failed to update avatar', 'error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setDisplayName(user.displayName);
      setActiveBanner(user.bannerAnimation || '');
      setActiveEffect(user.profileEffect || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="empty-state pt-6rem">
        <div className="empty-state-icon"><i className="fas fa-lock" /></div>
        <h3>Sign in required</h3>
        <p>You need to be signed in to view your dashboard.</p>
      </div>
    );
  }

  const myPosts = posts.filter(p => p.authorUid === user.uid);
  const totalKarma = myPosts.reduce((acc, p) => acc + p.upvotes - p.downvotes, 0);

    const saveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { 
        bio, 
        displayName,
        bannerAnimation: activeBanner,
        profileEffect: activeEffect
      });
      await refreshUser();
      setSaved(true);
      notify('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      notify('Failed to save settings', 'error');
    } finally { setSaving(false); }
  };

  function formatJoined(ts: unknown): string {
    try {
      if (!ts) return 'Recently';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const date = (ts as any).toDate ? (ts as any).toDate() : new Date(ts as number);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch { return 'Recently'; }
  }

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1 className="dash-title">My Dashboard</h1>
        <p className="dash-subtitle">@{user.username} · {user.role}</p>
      </div>

      {/* Profile card */}
      <div className={`profile-card effect-${activeEffect}`}>
        <div className={`profile-banner anim-${activeBanner}`}>
          {activeBanner === 'mesh' && <div className="mesh-gradient" />}
        </div>
        <div className="profile-body">
          <div className="flex items-end mb-075rem gap-1">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-inner">
                <AvatarImg src={user.photoURL || ''} name={user.displayName} size={80} />
                <button 
                  className="avatar-edit-overlay" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Change Avatar"
                >
                  {uploading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-camera" />}
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                title="Avatar upload"
                aria-label="Upload profile picture"
              />
            </div>
            <div className="flex-1">
              <div className="profile-name">{user.displayName}</div>
              <div className="profile-username">@{user.username}</div>
            </div>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-meta">
            <span><i className="fas fa-calendar" /> Joined {mounted ? formatJoined(user.joinedAt) : '...'}</span>
            <span><i className="fas fa-fire" /> {totalKarma} karma</span>
            <span><i className="fas fa-pen" /> {user.postsCount} posts</span>
            <span><i className="fas fa-comment" /> {user.commentsCount} comments</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'posts', 'voice', 'settings'].map(t => (
          <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t === 'voice' ? 'Voice Channels' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats grid */}
          <div className="dash-grid">
            <StatCard icon="fa-pen" num={user.postsCount} label="Posts" color="var(--primary-light)" />
            <StatCard icon="fa-comment" num={user.commentsCount} label="Comments" color="var(--cyan)" />
            <StatCard icon="fa-fire" num={totalKarma} label="Karma" color="var(--green)" />
            <StatCard icon="fa-hashtag" num={user.joinedChannels?.length || 0} label="Channels" color="var(--pink)" />
          </div>

          <div className="dash-section">
            <div className="dash-section-title"><i className="fas fa-clock" /> Recent Posts</div>
            {myPosts.slice(0, 5).length === 0 ? (
              <div className="empty-state pt-2rem">
                <div className="empty-state-icon"><i className="fas fa-pen" /></div>
                <h3>No posts yet</h3>
                <p>Create your first post in the forum.</p>
              </div>
            ) : myPosts.slice(0, 5).map(p => (
              <PostCard key={p.id} post={p} onClick={() => router.push(`/community?post=${p.id}`)} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'posts' && (
        <div className="dash-section">
          <div className="dash-section-title"><i className="fas fa-layer-group" /> All My Posts ({myPosts.length})</div>
          {myPosts.length === 0 ? (
            <div className="empty-state pt-2rem">
              <div className="empty-state-icon"><i className="fas fa-pen" /></div>
              <h3>No posts yet</h3>
            </div>
          ) : myPosts.map(p => (
            <PostCard key={p.id} post={p} onClick={() => router.push(`/community?post=${p.id}`)} />
          ))}
        </div>
      )}

      {activeTab === 'voice' && (
        <div className="dash-section">
           <div className="dash-section-title"><i className="fas fa-plus-circle" /> Create Voice Channel</div>
           <div className="glass-card p-25rem br-24 flex flex-col gap-15rem mb-2rem">
              <div className="flex gap-15rem flex-wrap">
                <div className="flex-1 min-w-200">
                  <label className="modal-label mb-05rem block">Channel Display Name</label>
                  <input 
                    className="form-input" 
                    value={newChName} 
                    onChange={e => setNewChName(e.target.value)} 
                    placeholder="E.g. Gaming Lounge"
                  />
                </div>
                <div className="flex-1 min-w-200">
                  <label className="modal-label mb-05rem block">Password (Optional)</label>
                  <input 
                    type="password"
                    className="form-input" 
                    value={newChPass} 
                    onChange={e => setNewChPass(e.target.value)} 
                    placeholder="Leave empty for public"
                  />
                </div>
              </div>
              <div className="flex gap-2rem items-center flex-wrap">
                 <div className="flex flex-col gap-075">
                    <label className="modal-label mb-05rem block">Theme Color</label>
                    <input 
                      type="color" 
                      className="color-picker-custom" 
                      value={newChColor} 
                      onChange={e => setNewChColor(e.target.value)} 
                      title="Select theme color"
                    />
                 </div>
                 <div className="flex flex-col gap-075 flex-1">
                    <label className="modal-label mb-075rem block">Select Icon</label>
                    <div className="flex flex-wrap">
                       {['fa-volume-up', 'fa-microphone', 'fa-headset', 'fa-gamepad', 'fa-music', 'fa-code'].map(ic => (
                         <button 
                           key={ic} 
                           className={`icon-select-btn ${newChIcon === ic ? 'active' : ''}`}
                           onClick={() => setNewChIcon(ic)}
                           title={`Select ${ic.split('-')[1]} icon`}
                           aria-label={`Select ${ic.split('-')[1]} icon`}
                         >
                           <i className={`fas ${ic}`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <button 
                className="btn-primary btn-lg mt-25rem flex-center gap-075 py-125rem br-50" 
                disabled={creating || !newChName}
                title="Create Voice Channel"
                onClick={async () => {
                  setCreating(true);
                  try {
                    const id = await createChannel({
                      name: newChName.toLowerCase().replace(/\s+/g, '-'),
                      displayName: newChName,
                      icon: newChIcon,
                      color: newChColor,
                      type: 'voice',
                      description: `Voice channel created by ${user.username}`,
                      isPrivate: !!newChPass,
                      password: newChPass || undefined,
                      createdBy: user.uid,
                    });
                    notify('Voice channel created!', 'success');
                    setNewChName('');
                    setNewChPass('');
                    router.push(`/channels?ch=${id}`);
                  } catch {
                    notify('Failed to create channel', 'error');
                  } finally { setCreating(false); }
                }}
              >
                {creating ? 'Creating...' : <><i className="fas fa-plus" /> Create Channel</>}
              </button>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="dash-section">
          <div className="dash-section-title"><i className="fas fa-gear" /> Account Settings</div>
          <div className="glass-card p-15 br-16 flex flex-col gap-1">
            <div>
              <label className="modal-label" htmlFor="disp-name">Display Name</label>
              <input 
                id="disp-name"
                className="form-input" 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                placeholder="Display Name"
                title="Display Name"
              />
            </div>
            <div>
              <label className="modal-label" htmlFor="bio-input">Bio</label>
              <textarea 
                id="bio-input"
                className="form-input resize-v" 
                rows={3} 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Tell us about yourself"
                title="Bio"
              />
            </div>
            <div className="flex-gap-05">
              <button className="btn-primary btn-sm" onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving…' : <><i className="fas fa-save" /> Save</>}
              </button>
              {saved && <span className="text-green text-sm flex items-center"><i className="fas fa-check" /> Saved!</span>}
            </div>

            <div className="sidebar-divider m-05-0" />

            {/* Decorations Section */}
            <div className="decorations-panel">
              <h4 className="settings-section-title">Banner Animations</h4>
              <div className="flex gap-075 flex-wrap mb-1rem">
                {['', 'aurora', 'sunset', 'midnight', 'mesh'].map(anim => (
                  <button 
                    key={anim}
                    className={`btn-decoration ${activeBanner === anim ? 'active' : ''}`}
                    onClick={() => setActiveBanner(anim)}
                    title={`Set banner to ${anim || 'none'}`}
                  >
                    <div className={`preview-circle anim-${anim}`} />
                    <span>{anim || 'None'}</span>
                  </button>
                ))}
              </div>

              <h4 className="settings-section-title">Spatial Effects</h4>
              <div className="flex gap-075 flex-wrap mb-1rem">
                {['', 'glow', 'pulse', 'rainbow'].map(eff => (
                  <button 
                    key={eff}
                    className={`btn-decoration ${activeEffect === eff ? 'active' : ''}`}
                    onClick={() => setActiveEffect(eff)}
                    title={`Set effect to ${eff || 'none'}`}
                  >
                    <div className={`preview-circle effect-${eff}`} />
                    <span>{eff || 'None'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-divider m-05-0" />

            <button className="btn-danger self-start" onClick={signOut}>
              <i className="fas fa-sign-out-alt" /> Sign Out
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        .resize-v { resize: vertical; }
        .m-05-0 { margin: 0.5rem 0; }
        .self-start { align-self: flex-start; }
        .color-picker-custom {
          width: 50px; height: 50px; border-radius: 12px; border: 1px solid var(--border);
          background: transparent; cursor: pointer; padding: 2px;
        }
        .icon-select-btn {
          width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border);
          background: rgba(255,255,255,0.03); color: var(--text-2); cursor: pointer;
          transition: all 0.2s; margin-right: 0.75rem; margin-bottom: 0.75rem;
        }
        .icon-select-btn:hover { background: rgba(255,255,255,0.06); border-color: var(--primary-light); }
        .icon-select-btn.active { background: var(--primary); color: #fff; border-color: var(--primary-light); }
        
        .profile-avatar-inner {
          width: 80px; height: 80px; border-radius: 50%; border: 4px solid var(--bg);
          position: relative; overflow: hidden; background: var(--bg-card);
          display: flex; align-items: center; justify-content: center;
        }
        .avatar-edit-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.6); 
          opacity: 0; transition: opacity 0.2s; border: none; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
        }
        .profile-avatar-inner:hover .avatar-edit-overlay { opacity: 1; }
        .hidden { display: none; }

        .mb-05rem { margin-bottom: 0.5rem; }
        .mb-075rem { margin-bottom: 0.75rem; }
        .mb-2rem { margin-bottom: 2rem; }
        .mt-1rem { margin-top: 1rem; }
        .mt-25rem { margin-top: 2.5rem; }
        .p-25rem { padding: 2.5rem; }
        .gap-05 { gap: 0.5rem; }
        .gap-075 { gap: 0.75rem; }
        .gap-1rem { gap: 1rem; }
        .gap-15rem { gap: 1.5rem; }
        .gap-2rem { gap: 2rem; }
        .block { display: block; }

        /* Banner Animations */
        .profile-banner { height: 120px; position: relative; overflow: hidden; background: linear-gradient(135deg, #1e1e2e, #2d2d44); }
        .anim-aurora { background: linear-gradient(270deg, #7c3aed, #06b6d4, #10b981); background-size: 600% 600%; animation: auroraShift 10s ease infinite; }
        .anim-sunset { background: linear-gradient(270deg, #f43f5e, #fb923c, #7c3aed); background-size: 600% 600%; animation: auroraShift 12s ease infinite; }
        .anim-midnight { background: linear-gradient(270deg, #1e1b4b, #312e81, #1e1e2e); background-size: 600% 600%; animation: auroraShift 15s ease infinite; }
        
        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .mesh-gradient {
          position: absolute; inset: 0; opacity: 0.4;
          background-image: 
            radial-gradient(at 0% 0%, var(--primary) 0, transparent 50%),
            radial-gradient(at 50% 0%, var(--cyan) 0, transparent 50%),
            radial-gradient(at 100% 0%, var(--pink) 0, transparent 50%);
          filter: blur(40px);
          animation: meshPulse 8s infinite alternate;
        }
        @keyframes meshPulse {
          from { transform: scale(1); }
          to { transform: scale(1.2); }
        }

        /* Spatial Effects */
        .profile-card { transition: all 0.5s ease; position: relative; }
        .effect-glow { box-shadow: 0 0 30px rgba(124, 58, 237, 0.4); border-color: rgba(124, 58, 237, 0.5) !important; }
        .effect-pulse { animation: cardPulse 3s infinite; }
        .effect-rainbow { border: 2px solid transparent; border-image: linear-gradient(to right, #7c3aed, #06b6d4, #f43f5e) 1; }

        @keyframes cardPulse {
          0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(124, 58, 237, 0); }
          100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
        }

        .effect-glow .profile-avatar-inner { box-shadow: 0 0 20px var(--primary); }
        .effect-rainbow .profile-avatar-inner { border-color: #f43f5e !important; }

        /* Settings UI */
        .settings-section-title { font-size: 0.75rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .btn-decoration {
          background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px;
          padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer;
          transition: all 0.2s; color: var(--text-2); font-size: 0.85rem;
        }
        .btn-decoration:hover { background: rgba(255,255,255,0.06); border-color: var(--primary-light); }
        .btn-decoration.active { background: rgba(124, 58, 237, 0.1); border-color: var(--primary); color: #fff; }
        .preview-circle { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function StatCard({ icon, num, label, color }: { icon: string; num: number; label: string; color: string }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon"><i className={`fas ${icon}`} /></div>
      <div className="stat-card-num">{num}</div>
      <div className="stat-card-label">{label}</div>
      <style jsx>{`
        .stat-card { --stat-color: ${color}; }
      `}</style>
    </div>
  );
}
