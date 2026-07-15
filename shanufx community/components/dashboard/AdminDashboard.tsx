'use client';

import { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, setDoc, onSnapshot,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { useOnlineCount } from '@/lib/hooks/useChat';
import { getAllUsers } from '@/lib/hooks/usePosts';
import type { CommunityUser, Channel, Post, InviteToken } from '@/lib/types';
import { AvatarImg } from '../layout/Navbar';

const ROLE_ORDER = ['primary', 'admin', 'member', 'guest'] as const;

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const { notify, confirm } = useUI();
  const onlineCount = useOnlineCount();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [invites, setInvites] = useState<InviteToken[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [newChannel, setNewChannel] = useState({ 
    name: '', 
    displayName: '', 
    icon: 'fa-hashtag', 
    color: '#7c3aed', 
    type: 'chat' as Channel['type'], 
    description: '',
    isLocked: false,
    allowedRoles: [] as string[]
  });
  const [savingChannel, setSavingChannel] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const isAdmin = role === 'primary' || role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    
    // Real-time Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data() } as CommunityUser)));
    });

    // Real-time Channels
    const unsubChannels = onSnapshot(query(collection(db, 'channels'), orderBy('name')), (snap) => {
      setChannels(snap.docs.map(d => ({ id: d.id, ...d.data() } as Channel)));
    });

    // Real-time Posts
    const unsubPosts = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
    });

    // Real-time Invites
    const unsubInvites = onSnapshot(collection(db, 'inviteTokens'), (snap) => {
      setInvites(snap.docs.map(d => d.data() as InviteToken));
    });

    return () => {
      unsubUsers();
      unsubChannels();
      unsubPosts();
      unsubInvites();
    };
  }, [isAdmin]);

  const fetchAll = () => {
    // This is now handled by snapshots, but we keep the button for manual refresh of other things if needed
    notify('Dashboard is already synced in real-time', 'info');
  };

  const changeRole = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      notify(`Role updated for user`, 'success');
    } catch {
      notify('Failed to update role', 'error');
    }
  };

  const handleBan = async (uid: string, hours: number | 'perm') => {
    confirm({
      title: hours === 'perm' ? 'Permanent Ban' : 'Temporary Ban',
      message: `Are you sure you want to ${hours === 'perm' ? 'permanently ban' : `ban for ${hours} hours`} this user?`,
      confirmText: 'Ban User',
      onConfirm: async () => {
        try {
          const until = hours === 'perm' ? 'permanent' : Date.now() + (hours * 3600000);
          await updateDoc(doc(db, 'users', uid), {
            isBanned: true,
            bannedUntil: until
          });
          notify('User banned successfully', 'success');
        } catch {
          notify('Failed to ban user', 'error');
        }
      }
    });
  };

  const handleUnban = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isBanned: false,
        bannedUntil: null
      });
      notify('User unbanned', 'success');
    } catch {
      notify('Failed to unban user', 'error');
    }
  };

  const deletePost = async (postId: string) => {
    confirm({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This cannot be undone.',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'posts', postId));
          setPosts(prev => prev.filter(p => p.id !== postId));
          notify('Post deleted', 'success');
        } catch {
          notify('Failed to delete post', 'error');
        }
      }
    });
  };

  const createChannel = async () => {
    if (!newChannel.name.trim()) return;
    setSavingChannel(true);
    try {
      const id = newChannel.name.toLowerCase().replace(/\s+/g, '-');
      const channelData = {
        ...newChannel,
        name: newChannel.name.toLowerCase().replace(/\s+/g, '-'),
        memberCount: 0,
        isPrivate: false,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'channels', id), channelData);
      setNewChannel({ 
        name: '', 
        displayName: '', 
        icon: 'fa-hashtag', 
        color: '#7c3aed', 
        type: 'chat', 
        description: '',
        isLocked: false,
        allowedRoles: []
      });
      notify('Channel created successfully', 'success');
      fetchAll();
    } catch {
      notify('Failed to create channel', 'error');
    } finally { setSavingChannel(false); }
  };

  const deleteChannel = async (id: string) => {
    confirm({
      title: 'Delete Channel',
      message: 'Delete this channel? Messages will not be deleted.',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'channels', id));
          setChannels(prev => prev.filter(c => c.id !== id));
          notify('Channel deleted', 'success');
        } catch {
          notify('Failed to delete channel', 'error');
        }
      }
    });
  };

  const generateInvite = async (expiresIn: number) => {
    try {
      const token = nanoid(21);
      const invite: InviteToken = {
        token,
        createdBy: user?.uid || '',
        expiresAt: Date.now() + expiresIn,
        isUsed: false,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'inviteTokens', token), invite);
      setInvites(prev => [invite, ...prev]);
      notify('Invite link generated', 'success');
    } catch {
      notify('Failed to generate invite', 'error');
    }
  };

  const copyInvite = (token: string) => {
    const url = `${window.location.origin}/join?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    notify('Link copied to clipboard', 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteInvite = async (token: string) => {
    confirm({
      title: 'Delete Invite',
      message: 'Delete this invite link?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'inviteTokens', token));
          setInvites(prev => prev.filter(inv => inv.token !== token));
          notify('Invite deleted', 'success');
        } catch {
          notify('Failed to delete invite', 'error');
        }
      }
    });
  };

  const clearAllInvites = async () => {
    confirm({
      title: 'Clear All Invites',
      message: 'Delete ALL invite links? This cannot be undone.',
      confirmText: 'Clear All',
      onConfirm: async () => {
        setLoadingData(true);
        try {
          const batch = invites.map(inv => deleteDoc(doc(db, 'inviteTokens', inv.token)));
          await Promise.all(batch);
          setInvites([]);
          notify('All invites cleared', 'success');
        } catch {
          notify('Failed to clear invites', 'error');
        } finally { setLoadingData(false); }
      }
    });
  };

  if (!isAdmin) {
    return (
      <div className="empty-state pt-6rem">
        <div className="empty-state-icon"><i className="fas fa-shield" /></div>
        <h3>Access Denied</h3>
        <p>Admin or Primary role required.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const todayPosts = posts.filter(p => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const date = (p.createdAt as any)?.toDate ? (p.createdAt as any).toDate() : new Date(p.createdAt as number);
      return Date.now() - date.getTime() < 86400000;
    } catch { return false; }
  }).length;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="dash-title">
              <i className="fas fa-shield text-primary mr-05" />
              Admin Dashboard
            </h1>
            <p className="dash-subtitle">Full platform control</p>
          </div>
          <button 
            className="btn-outline btn-sm br-8" 
            onClick={fetchAll} 
            disabled={loadingData} 
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <i className={`fas fa-refresh ${loadingData ? 'fa-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-grid">
        <StatCard icon="fa-users" num={users.length} label="Total Users" color="var(--primary-light)" />
        <StatCard icon="fa-pen" num={todayPosts} label="Posts Today" color="var(--cyan)" />
        <StatCard icon="fa-circle" num={onlineCount} label="Online Now" color="var(--green)" />
        <StatCard icon="fa-hashtag" num={channels.length} label="Channels" color="var(--pink)" />
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'channels', 'users', 'posts', 'invites'].map(t => (
          <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'users' && <span className="badge-purple badge-sm p-04rem ml-03rem fs-065rem br-50">{users.length}</span>}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="dash-section">
          <div className="dash-section-title"><i className="fas fa-clock" /> Recent Activity</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>User</th><th>Post</th><th>Channel</th><th>Score</th></tr></thead>
              <tbody>
                {posts.slice(0, 10).map(p => (
                  <tr key={p.id}>
                    <td className="post-author font-bold">{p.authorName}</td>
                    <td className="truncate max-w-260">{p.title}</td>
                    <td><span className="font-mono text-xs">#{p.channelId}</span></td>
                    <td className={p.upvotes - p.downvotes > 0 ? 'text-green' : 'text-muted'}>
                      {p.upvotes - p.downvotes > 0 ? '+' : ''}{p.upvotes - p.downvotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Channels tab */}
      {activeTab === 'channels' && (
        <div>
          <div className="dash-section">
            <div className="dash-section-title"><i className="fas fa-plus" /> Create Channel</div>
            <div className="glass-card p-125 br-14 flex gap-075 flex-wrap items-end">
              <div className="flex-1 min-w-120">
                <label className="modal-label">Channel ID</label>
                <input className="form-input" placeholder="android-dev" value={newChannel.name} onChange={e => setNewChannel(v => ({ ...v, name: e.target.value }))} />
              </div>
              <div className="flex-1 min-w-120">
                <label className="modal-label">Display Name</label>
                <input className="form-input" placeholder="Android Dev" value={newChannel.displayName} onChange={e => setNewChannel(v => ({ ...v, displayName: e.target.value }))} />
              </div>
              <div className="flex-1 min-w-120">
                <label className="modal-label">Description</label>
                <input className="form-input" placeholder="Channel description" value={newChannel.description} onChange={e => setNewChannel(v => ({ ...v, description: e.target.value }))} />
              </div>
              <div>
                <label className="modal-label">Type</label>
                <select 
                  className="composer-select" 
                  value={newChannel.type} 
                  onChange={e => setNewChannel(v => ({ ...v, type: e.target.value as Channel['type'] }))}
                  title="Channel Type"
                  aria-label="Select Channel Type"
                >
                  <option value="chat">Chat</option>
                  <option value="forum">Forum</option>
                  <option value="voice">Voice (LiveKit)</option>
                </select>
              </div>
              <div className="flex items-center gap-05 pb-05">
                <input 
                  type="checkbox" 
                  id="lock-ch" 
                  checked={newChannel.isLocked} 
                  onChange={e => setNewChannel(v => ({ ...v, isLocked: e.target.checked }))} 
                />
                <label htmlFor="lock-ch" className="text-xs text-muted">Locked (Admins only)</label>
              </div>
              <button className="btn-primary btn-sm" onClick={createChannel} disabled={savingChannel}>
                {savingChannel ? 'Creating…' : <><i className="fas fa-plus" /> Create</>}
              </button>
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-section-title"><i className="fas fa-hashtag" /> All Channels ({channels.length})</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Status</th><th>Members</th><th>Actions</th></tr></thead>
                <tbody>
                  {channels.map(ch => (
                    <tr key={ch.id}>
                      <td className="font-bold text-white">
                        {ch.type === 'voice' ? <i className="fas fa-volume-up mr-05 text-cyan" /> : '#'}
                        {ch.name}
                      </td>
                      <td>
                        <span className={`role-badge ${ch.type === 'forum' ? 'role-admin' : ch.type === 'voice' ? 'role-primary' : 'role-member'}`}>
                          {ch.type}
                        </span>
                      </td>
                      <td className="text-muted text-xs">{ch.description}</td>
                      <td>
                        {ch.isLocked ? (
                          <span className="text-danger text-xs"><i className="fas fa-lock" /> Locked</span>
                        ) : (
                          <span className="text-green text-xs"><i className="fas fa-lock-open" /> Public</span>
                        )}
                      </td>
                      <td className="font-mono text-xs">{ch.memberCount}</td>
                      <td>
                        <button 
                          className="btn-danger btn-sm" 
                          onClick={() => deleteChannel(ch.id)}
                          title="Delete Channel"
                          aria-label="Delete Channel"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="dash-section">
          <div className="flex items-center gap-075 mb-1">
            <div className="dash-section-title mb-0"><i className="fas fa-users" /> Users ({users.length})</div>
            <div className="flex-1" />
            <input
              className="form-input max-w-220"
              placeholder="Search users…"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              title="Search Users"
              aria-label="Search Users"
            />
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>User</th><th>Username</th><th>Role</th><th>Karma</th><th>Posts</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.uid}>
                    <td>
                      <div className="flex-gap-05">
                        <AvatarImg src={u.avatar} name={u.displayName} size={28} />
                        <span className="font-bold text-white text-sm">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs">@{u.username}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                      {u.isBanned && (
                        <span className="badge-danger badge-sm ml-03rem fs-065rem br-5 text-xs font-bold px-02rem py-01rem banned-badge">
                          BANNED
                        </span>
                      )}
                    </td>
                    <td className="font-mono text-xs">{u.karma}</td>
                    <td>{u.postsCount}</td>
                    <td>
                      {u.uid !== user?.uid && (
                        <div className="flex items-center gap-05">
                          <select
                            className="composer-select text-xs max-w-100"
                            value={u.role}
                            onChange={e => changeRole(u.uid, e.target.value)}
                            title="Change User Role"
                            aria-label={`Change role for ${u.displayName}`}
                          >
                            {ROLE_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          
                          {u.isBanned ? (
                            <button className="btn-success btn-xs unban-btn" onClick={() => handleUnban(u.uid)}>
                              Unban
                            </button>
                          ) : (
                            <select
                              className="composer-select text-xs max-w-100"
                              defaultValue=""
                              onChange={e => {
                                if (e.target.value === 'perm') handleBan(u.uid, 'perm');
                                else if (e.target.value) handleBan(u.uid, Number(e.target.value));
                                e.target.value = ''; // Reset
                              }}
                              title="Ban User Options"
                            >
                              <option value="" disabled>Ban...</option>
                              <option value="1">1 Hour</option>
                              <option value="24">24 Hours</option>
                              <option value="168">7 Days</option>
                              <option value="perm">Permanent</option>
                            </select>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Posts tab */}
      {activeTab === 'posts' && (
        <div className="dash-section">
          <div className="dash-section-title"><i className="fas fa-pen" /> All Posts ({posts.length})</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Author</th><th>Channel</th><th>Score</th><th>Comments</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td className="truncate max-w-240 font-bold text-white">{p.title}</td>
                    <td className="text-sm text-primary">{p.authorName}</td>
                    <td><span className="font-mono text-xs">#{p.channelId}</span></td>
                    <td>{p.upvotes - p.downvotes}</td>
                    <td>{p.commentCount}</td>
                    <td>
                      <button 
                        className="btn-danger btn-sm" 
                        onClick={() => deletePost(p.id)}
                        title="Delete Post"
                        aria-label="Delete Post"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invites tab */}
      {activeTab === 'invites' && (
        <div className="dash-section">
          <div className="dash-section-title"><i className="fas fa-link" /> Invite Links</div>

          <div className="glass-card flex items-center gap-075 mb-125 p-125 br-14">
            <span className="text-sm text-muted">Generate invite link:</span>
            <button className="btn-outline btn-sm" onClick={() => generateInvite(24 * 3600000)}>24h</button>
            <button className="btn-outline btn-sm" onClick={() => generateInvite(7 * 24 * 3600000)}>7 days</button>
            <button className="btn-outline btn-sm" onClick={() => generateInvite(365 * 24 * 3600000)}>Never expires</button>
            <div className="flex-1" />
            {invites.length > 0 && (
              <button className="btn-danger btn-sm" onClick={clearAllInvites} title="Clear All Invites" aria-label="Clear All Invites">
                <i className="fas fa-broom" /> Clear All
              </button>
            )}
          </div>

          <div className="flex flex-col gap-075">
            {invites.length === 0 && (
              <div className="empty-state pt-2rem">
                <div className="empty-state-icon"><i className="fas fa-link" /></div>
                <h3>No invite links yet</h3>
              </div>
            )}
            {invites.map(inv => {
              const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/join?token=${inv.token}`;
              const expired = inv.expiresAt < Date.now();
              return (
                <div key={inv.token} className="glass-card flex items-center gap-075 p-125 br-12">
                  <div className="flex-1 min-w-200">
                    <div className="font-mono text-xs text-primary truncate mb-02rem">{url}</div>
                    <div className={`text-xs ${expired ? 'text-danger' : inv.isUsed ? 'text-muted' : 'text-green'}`}>
                      {inv.isUsed ? '✓ Used' : expired ? '⚠ Expired' : `Expires ${new Date(inv.expiresAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <button
                    className="btn-outline btn-sm br-8"
                    onClick={() => copyInvite(inv.token)}
                    title="Copy Invite Link"
                    aria-label="Copy Invite Link"
                  >
                    <i className={`fas ${copied === inv.token ? 'fa-check' : 'fa-copy'}`} />
                    {copied === inv.token ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => deleteInvite(inv.token)}
                    title="Delete invite link"
                    aria-label="Delete Invite Link"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style jsx>{`
        .banned-badge {
          background: var(--danger);
          color: #fff;
          border-radius: 4px;
        }
        .unban-btn {
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
        }
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
