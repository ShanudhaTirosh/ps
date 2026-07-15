'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  LiveKitRoom, 
  VideoConference, 
  RoomAudioRenderer,
  Chat,
  useLocalParticipant,
  useChat,
} from '@livekit/components-react';
import { getAllUsers, sendInvite } from '@/lib/hooks/usePosts';
import { processImage } from '@/lib/utils/image';
import '@livekit/components-styles';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';

interface Props {
  channelId: string;
  channelName: string;
  isLocked?: boolean;
}

export default function VoiceRoom({ channelId, channelName, isLocked }: Props) {
  const { user, role } = useAuth();
  const { notify } = useUI();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [preJoin, setPreJoin] = useState(true);
  const [passInput, setPassInput] = useState('');
  const [isLockedByPass, setIsLockedByPass] = useState(false);
  const [channelData, setChannelData] = useState<import('@/lib/types').Channel | null>(null);

  const isAdmin = role === 'primary' || role === 'admin';
  const isInvited = user?.joinedChannels?.includes(channelId);
  // Allow joining if not locked, or if user is admin/invited, or if they have the password (checked later)
  const canJoin = user && user.role !== 'guest';

  useEffect(() => {
    const fetchChannel = async () => {
      const snap = await getDoc(doc(db, 'channels', channelId));
      if (snap.exists()) {
        const data = snap.id ? { id: snap.id, ...snap.data() } as any : null;
        setChannelData(data);
        if (data?.password && data.createdBy !== user?.uid && role !== 'admin' && role !== 'primary') {
          setIsLockedByPass(true);
        }
      }
    };
    fetchChannel();
  }, [channelId, user?.uid, role]);

  useEffect(() => {
    if (!canJoin || !user || isLockedByPass) return;
    if (user.role === 'guest') return;

    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${channelId}&username=${user.username}`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          notify('Failed to get voice token', 'error');
        }
      } catch (e) {
        console.error(e);
        notify('Voice server connection error', 'error');
      }
    };

    fetchToken();
  }, [channelId, user, canJoin, notify, isLockedByPass]);

  if (user?.role === 'guest') {
    return (
      <div className="voice-room flex-center h-full bg-dark">
        <div className="glass-card p-2rem text-center max-w-400">
           <h3>Complete Registration</h3>
           <p className="text-muted text-sm mb-15">Only fully registered members can join voice channels.</p>
           <button className="btn-primary" onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (isLockedByPass) {
    return (
      <div className="voice-room flex-center h-full bg-dark">
        <div className="glass-card p-2rem br-20 flex flex-col items-center gap-15 text-center max-w-360">
           <div className="voice-avatar-large"><i className="fas fa-key text-primary" /></div>
           <h3>Locked Channel</h3>
           <p className="text-muted text-sm">This channel requires a password to join.</p>
           <input 
             type="password" 
             className="form-input" 
             placeholder="Enter password..."
             value={passInput}
             onChange={e => setPassInput(e.target.value)}
           />
           <button 
             className="btn-primary w-full" 
             onClick={() => {
               if (passInput === channelData?.password) {
                 setIsLockedByPass(false);
               } else {
                 notify('Incorrect password', 'error');
               }
             }}
           >
             Unlock & Join
           </button>
        </div>
      </div>
    );
  }

  if (!canJoin) {
    return (
      <div className="voice-room flex-center h-full bg-dark">
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fas fa-lock" /></div>
          <h3>This channel is locked</h3>
          <p>Only moderators or invited members can join this voice channel.</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="loading-screen bg-dark">
        <div className="loading-spin" />
        <div className="loading-text">Connecting to LiveKit...</div>
      </div>
    );
  }

    if (preJoin) {
      return (
        <div className="voice-room flex-center h-full bg-dark">
          <div className="glass-card join-square-card flex flex-col items-center justify-center gap-2rem text-center">
          <div className="voice-avatar-large mb-05rem voice-float-anim">
            <i className="fas fa-headset text-primary" />
          </div>
          <div>
            <h3 className="mb-1rem fs-25rem">Ready to join?</h3>
            <p className="voice-join-desc">Join <b>{channelName}</b> to start talking with other members.</p>
          </div>
          <button className="btn-primary btn-lg w-full flex-center gap-075 py-125rem br-50 mt-1rem" onClick={() => setPreJoin(false)}>
             Join Channel
          </button>
        </div>
        <style jsx>{`
           .join-square-card {
             width: 550px;
             height: 550px;
             padding: 4rem;
             border-radius: 40px;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
           }
           .voice-avatar-large {
             width: 120px; height: 120px; border-radius: 50%;
             background: rgba(124, 58, 237, 0.1);
             display: flex; align-items: center; justify-content: center;
             border: 1px solid rgba(124, 58, 237, 0.2);
           }
           .voice-avatar-large i { font-size: 4rem; }
           .voice-float-anim { animation: float 3s ease-in-out infinite; }
           .voice-join-desc {
             font-size: 0.85rem;
             line-height: 1.6;
             color: var(--text-2);
           }
           .invite-modal-overlay { z-index: 1100; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="voice-room-container">
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ''}
        onDisconnected={() => setToken(null)}
        onError={(err) => {
          if (err.name === 'NotAllowedError') {
            notify('Microphone permission denied. Please enable it in your browser settings.', 'error');
          } else {
            notify(`Connection error: ${err.message}`, 'error');
          }
        }}
        data-lk-theme="default"
        className="h-full"
      >
        <div className="voice-header-overlay">
          <div className="flex items-center gap-075">
            <div className="voice-status-indicator" />
            <span className="voice-title">{channelName}</span>
          </div>
        </div>
        
        {/* Custom video conference with our styles */}
        <VideoConference />
        
        {/* Custom Floating Control Bar */}
        <CustomControls channelData={channelData} onLeave={() => router.push('/channels?ch=general')} />
        
        <RoomAudioRenderer />
      </LiveKitRoom>

      <style jsx global>{`
        .voice-room-container {
          height: 100%;
          background: #05050a;
          position: relative;
          overflow: hidden;
        }
        .bg-dark { background: #05050a !important; }
        .voice-header-overlay {
          position: absolute;
          top: 1.5rem;
          left: 2rem;
          z-index: 100;
          pointer-events: none;
          background: rgba(0,0,0,0.4);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .voice-status-indicator {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green); box-shadow: 0 0 10px var(--green);
          animation: pulse 2s infinite;
        }
        .voice-title { 
          font-family: 'Syne', sans-serif; 
          font-weight: 800; 
          font-size: 0.9rem;
          color: #fff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        /* Participant Grid Customization */
        .lk-video-conference {
          background: transparent !important;
          border: none !important;
        }
        .lk-grid-layout {
          padding: 2rem !important;
          padding-bottom: 8rem !important; /* Space for floating bar */
        }
        .lk-participant-tile {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          transition: transform 0.3s ease, border-color 0.3s ease !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
        }
        .lk-participant-tile:hover {
          transform: scale(1.02);
          border-color: var(--primary-light) !important;
        }
        .lk-focus-layout {
           background: transparent !important;
        }
        
        /* Hide default LiveKit elements we are replacing */
        .lk-control-bar { display: none !important; }
        .lk-settings-menu { 
           background: rgba(10, 8, 25, 0.95) !important;
           border: 1px solid var(--border) !important;
           backdrop-filter: blur(20px) !important;
        }
      `}</style>
    </div>
  );
}

function CustomControls({ channelData, onLeave }: { channelData: import('@/lib/types').Channel | null; onLeave: () => void }) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant();
  const [chatOpen, setChatOpen] = useState(false);
  const [showShareInfo, setShowShareInfo] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { user } = useAuth();
  const { notify } = useUI();

  const handleScreenShare = async () => {
    if (isScreenShareEnabled) {
      localParticipant.setScreenShareEnabled(false);
    } else {
      setShowShareInfo(true);
    }
  };

  const startSharing = async () => {
    setShowShareInfo(false);
    try {
      await localParticipant.setScreenShareEnabled(true);
    } catch (e) {
      console.error(e);
      notify('Failed to start screen share', 'error');
    }
  };
  
  return (
    <>
      <div className="voice-control-bar-wrap">
        <ControlBtn 
          active={isMicrophoneEnabled} 
          icon={isMicrophoneEnabled ? 'fa-microphone' : 'fa-microphone-slash'} 
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          title="Toggle Mic"
        />
        <ControlBtn 
          active={isCameraEnabled} 
          icon={isCameraEnabled ? 'fa-video' : 'fa-video-slash'} 
          onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
          title="Toggle Camera"
        />
        <ControlBtn 
          active={isScreenShareEnabled} 
          icon="fa-desktop" 
          onClick={handleScreenShare}
          title="Share Screen"
        />
        <ControlBtn 
          active={chatOpen} 
          icon="fa-comment" 
          onClick={() => setChatOpen(!chatOpen)}
          title="Toggle Chat"
        />
        <ControlBtn 
          active={showInviteModal} 
          icon="fa-user-plus" 
          onClick={() => setShowInviteModal(true)}
          title="Invite Members"
        />
        
        <div className="sidebar-divider voice-ctrl-divider" />
        
        <ControlBtn 
          active={false} 
          danger 
          icon="fa-phone-slash" 
          onClick={onLeave}
          title="Leave Channel"
        />
      </div>

      <style jsx>{`
        .voice-control-bar-wrap {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.75rem 1.5rem;
        }
      `}</style>

      {/* Basic Chat Overlay for LiveKit */}
      {chatOpen && (
        <div className="voice-chat-overlay glass-card">
           <PremiumChat />
        </div>
      )}

      {/* Invite Modal Overlay */}
      {showInviteModal && (
        <InviteModal 
          channel={channelData} 
          onClose={() => setShowInviteModal(false)} 
        />
      )}
      {showShareInfo && (
        <div className="modal-overlay flex-center voice-modal-z">
          <div className="glass-card p-25rem br-24 flex flex-col items-center text-center max-w-400">
            <div className="voice-avatar-large icon-glow-cyan mb-15rem">
               <i className="fas fa-desktop text-cyan share-icon-size" />
            </div>
            <div>
              <h3 className="mb-075 fs-11rem">Share your screen</h3>
              <p className="voice-modal-desc">
                A browser popup will appear. Select the <b>Window</b> or <b>Tab</b> you want to share with others in the channel.
              </p>
            </div>
            <div className="flex flex-col w-full mt-2rem">
              <button className="btn-primary btn-lg w-full py-125rem br-50 mb-125rem flex-center gap-05" onClick={startSharing}>
                <i className="fas fa-play fs-082rem" /> Start Sharing
              </button>
              <button className="btn-outline btn-sm w-full py-1rem br-50" onClick={() => setShowShareInfo(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .voice-chat-overlay {
          position: absolute;
          right: 2rem;
          top: 6rem;
          bottom: 8rem;
          width: 300px;
          z-index: 90;
          border-radius: 20px;
          animation: fadeIn 0.3s ease;
        }
        .voice-modal-z { z-index: 1000; }
        .share-icon-size { font-size: 2.2rem; }
        .voice-modal-desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.88rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .fs-11rem { font-size: 1.1rem; }
        .mb-075 { margin-bottom: 0.75rem; }
        .icon-glow-cyan {
          box-shadow: 0 0 40px rgba(6, 182, 212, 0.3);
          border-color: rgba(6, 182, 212, 0.5) !important;
          background: rgba(6, 182, 212, 0.1) !important;
        }
        .py-075rem { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-1rem { padding-top: 1rem; padding-bottom: 1rem; }
        .py-125rem { padding-top: 1.25rem; padding-bottom: 1.25rem; }
        .fs-082rem { font-size: 0.82rem; }
        .fs-15rem { font-size: 1.5rem; }
        .gap-125 { gap: 1.25rem; }
        .mb-05rem { margin-bottom: 0.5rem; }
        .mb-1rem { margin-bottom: 1rem; }
        .mb-125rem { margin-bottom: 1.25rem; }
        .mb-15rem { margin-bottom: 1.5rem; }
        .mt-15rem { margin-top: 1.5rem; }
        .mt-2rem { margin-top: 2rem; }
        .p-25rem { padding: 2.5rem; }
        .p-3rem { padding: 3rem; }
        .br-24 { border-radius: 24px; }
        .lh-16 { line-height: 1.6; }
      `}</style>

      <style jsx global>{`
        .lk-chat-themed {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .lk-chat {
          height: 100% !important;
          background: transparent !important;
          border: none !important;
        }
        .lk-chat-messages {
          padding: 1rem !important;
          background: transparent !important;
        }
        .lk-chat-entry {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.05) !important;
          border-radius: 12px !important;
          margin-bottom: 0.5rem !important;
          padding: 0.6rem 0.8rem !important;
        }
        .lk-chat-entry-name {
          color: var(--primary-light) !important;
          font-weight: 700 !important;
          font-size: 0.75rem !important;
        }
        .lk-chat-entry-message {
          color: var(--text) !important;
          font-size: 0.85rem !important;
        }
        .lk-chat-form {
          padding: 1rem !important;
          background: rgba(0,0,0,0.2) !important;
          border-top: 1px solid var(--border) !important;
        }
        .lk-chat-form-input {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          color: var(--text) !important;
          padding: 0.5rem 0.8rem !important;
          font-size: 0.85rem !important;
        }
        .lk-chat-form-button {
          background: var(--grad) !important;
          border-radius: 8px !important;
          border: none !important;
          color: #fff !important;
          font-weight: 600 !important;
        }
        .lk-chat-form-button:hover {
          opacity: 0.9 !important;
        }
      `}</style>
    </>
  );
}

function ControlBtn({ active, icon, onClick, danger, title }: { active: boolean; icon: string; onClick: () => void; danger?: boolean; title: string }) {
  return (
    <button 
      className={`voice-btn-custom ${active ? 'active' : ''} ${danger ? 'danger' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      <i className={`fas ${icon}`} />
    </button>
  );
}

function PremiumChat() {
  const { send, chatMessages } = useChat();
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const onSend = async () => {
    if (!text.trim()) return;
    await send(text.trim());
    setText('');
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const base64 = await processImage(file, 1280, 1280);
      await send(JSON.stringify({ type: 'image', content: base64 }));
    } finally {
      setProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="premium-chat">
      <div className="p-chat-header">Channel Chat</div>
      <div className="p-chat-msgs" ref={scrollRef}>
        {chatMessages.map((m, i) => {
          let isImage = false;
          let content = m.message;
          try {
            const parsed = JSON.parse(m.message);
            if (parsed.type === 'image') {
              isImage = true;
              content = parsed.content;
            }
          } catch (e) {}

          return (
            <div key={m.timestamp + i} className="p-chat-entry">
              <div className="p-chat-meta">
                <span className="p-chat-name">{m.from?.name || m.from?.identity}</span>
              </div>
              {isImage ? (
                <div className="p-chat-img">
                  <img src={content} alt="Attachment" />
                </div>
              ) : (
                <div className="p-chat-text">{content}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-chat-input-wrap">
        <input 
          type="file" 
          ref={fileRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImage} 
          title="Upload image attachment"
        />
        <button className="p-chat-btn" onClick={() => fileRef.current?.click()} disabled={processing} title="Send Image">
          {processing ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-image" />}
        </button>
        <input 
          className="p-chat-input" 
          placeholder="Type a message..." 
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          title="Chat Input"
        />
        <button className="p-chat-send" onClick={onSend} disabled={!text.trim()} title="Send Message">
          <i className="fas fa-paper-plane" />
        </button>
      </div>
      <style jsx>{`
        .premium-chat { display: flex; flex-direction: column; height: 100%; font-family: 'Inter', sans-serif; }
        .p-chat-header { padding: 1rem; border-bottom: 1px solid var(--border); font-weight: 700; font-size: 0.85rem; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.05em; }
        .p-chat-msgs { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .p-chat-entry { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0.6rem 0.8rem; }
        .p-chat-meta { margin-bottom: 0.25rem; }
        .p-chat-name { font-weight: 700; font-size: 0.72rem; color: var(--primary-light); }
        .p-chat-text { font-size: 0.85rem; color: var(--text); line-height: 1.4; word-break: break-word; }
        .p-chat-img { margin-top: 0.5rem; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); background: rgba(0, 0, 0, 0.2); transition: transform 0.2s ease, border-color 0.2s ease; }
        .p-chat-img:hover { transform: scale(1.02); border-color: var(--primary-light); }
        .p-chat-img img { width: 100%; max-height: 180px; object-fit: contain; display: block; }
        .p-chat-input-wrap { padding: 1rem; background: rgba(0,0,0,0.2); border-top: 1px solid var(--border); display: flex; gap: 0.5rem; align-items: center; }
        .p-chat-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 10px; color: #fff; padding: 0.5rem 0.75rem; font-size: 0.85rem; outline: none; }
        .p-chat-btn, .p-chat-send { background: transparent; border: none; color: var(--text-2); cursor: pointer; padding: 0.5rem; font-size: 1rem; transition: color 0.2s; }
        .p-chat-btn:hover, .p-chat-send:hover:not(:disabled) { color: var(--primary-light); }
        .p-chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

function InviteModal({ channel, onClose }: { channel: any; onClose: () => void }) {
  const [users, setUsers] = useState<import('@/lib/types').CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();
  const { notify } = useUI();

  useEffect(() => {
    getAllUsers().then(all => {
      setUsers(all.filter(u => u.uid !== currentUser?.uid));
      setLoading(false);
    });
  }, [currentUser?.uid]);

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async (targetUser: any) => {
    if (!currentUser || !channel) return;
    try {
      await sendInvite(currentUser, targetUser.uid, channel);
      notify(`Invite sent to ${targetUser.username}!`, 'success');
    } catch (e) {
      notify('Failed to send invite', 'error');
    }
  };

  return (
    <div className="modal-overlay flex-center invite-modal-overlay">
       <div className="glass-card p-15 flex flex-col gap-1 w-full max-w-400 br-24">
          <div className="flex justify-between items-center mb-05">
            <h3 className="mb-0">Invite Members</h3>
            <button className="notif-close" onClick={onClose} aria-label="Close modal">&times;</button>
          </div>
          <input 
            type="text" 
            className="form-input mb-05" 
            placeholder="Search members..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            title="Search members"
            aria-label="Search members to invite"
          />
          <div className="invite-user-list">
             {loading ? <div className="text-center p-1"><i className="fas fa-spinner fa-spin" /></div> : 
              filtered.length === 0 ? <div className="text-center p-1 text-muted">No users found</div> :
              filtered.map(u => (
                <div key={u.uid} className="invite-user-row">
                   <div className="flex items-center gap-075 flex-1">
                      <div className="mini-avatar"><i className="fas fa-user" /></div>
                      <div className="flex flex-col">
                        <span className="fs-082rem font-bold">{u.username}</span>
                        <span className="fs-065rem text-muted">{u.role}</span>
                      </div>
                   </div>
                   <button className="btn-primary btn-sm" onClick={() => handleInvite(u)}>Invite</button>
                </div>
              ))
             }
          </div>
       </div>
       <style jsx>{`
         .invite-user-list {
           max-height: 300px;
           overflow-y: auto;
           display: flex;
           flex-direction: column;
           gap: 0.5rem;
         }
         .invite-user-row {
           display: flex;
           align-items: center;
           padding: 0.5rem 0.75rem;
           background: rgba(255,255,255,0.03);
           border-radius: 12px;
           border: 1px solid transparent;
           transition: all 0.2s;
         }
         .invite-user-row:hover {
           background: rgba(255,255,255,0.06);
           border-color: rgba(124, 58, 237, 0.2);
         }
         .mini-avatar {
           width: 32px; height: 32px; border-radius: 50%;
           background: var(--primary); display: flex; align-items: center; justify-content: center;
           color: #fff; font-size: 0.8rem;
         }
       `}</style>
    </div>
  );
}
