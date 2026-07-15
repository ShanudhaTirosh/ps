'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useChannels } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/context/AuthContext';
import { AvatarImg } from './Navbar';
import type { Channel } from '@/lib/types';

export const STATIC_CHAT: Channel[] = [
  { id: 'general', name: 'general', displayName: 'General', icon: 'fa-hashtag', color: '#06b6d4', type: 'chat', description: 'General discussion', memberCount: 0, isPrivate: false },
  { id: 'android-dev', name: 'android-dev', displayName: 'Android Dev', icon: 'fa-android', color: '#10b981', type: 'chat', description: 'Android development', memberCount: 0, isPrivate: false },
  { id: 'web-projects', name: 'web-projects', displayName: 'Web Projects', icon: 'fa-code', color: '#a855f7', type: 'chat', description: 'Web project discussion', memberCount: 0, isPrivate: false },
  { id: 'iot-lab', name: 'iot-lab', displayName: 'IoT Lab', icon: 'fa-microchip', color: '#f59e0b', type: 'chat', description: 'IoT & hardware', memberCount: 0, isPrivate: false },
  { id: 'random', name: 'random', displayName: 'Random', icon: 'fa-shuffle', color: '#f472b6', type: 'chat', description: 'Off-topic', memberCount: 0, isPrivate: false },
];

interface Props {
  activeChatChannel?: string;
  onChatChannelSelect?: (id: string) => void;
}

export default function Sidebar({ activeChatChannel, onChatChannelSelect }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { channels } = useChannels();
  const { user } = useAuth();

  const inForum = pathname.startsWith('/community');
  const inChat = pathname.startsWith('/channels');

  const forumChannels = channels.filter(c => c.type === 'forum');
  const chatChannelsFromDB = channels.filter(c => (c.type === 'chat' || c.type === 'voice'));
  
  const chatChannels = chatChannelsFromDB.length > 0 ? chatChannelsFromDB : STATIC_CHAT;

  return (
    <aside className="app-sidebar">
      <div className="sidebar h-full">
        {/* Forum section */}
        <div className="sidebar-section-title">Forum</div>
        <SidebarBtn
          icon="fa-layer-group"
          label="All Posts"
          active={inForum && (pathname === '/community' || !pathname.includes('channel='))}
          color="#7c3aed"
          onClick={() => router.push('/community')}
        />
        {forumChannels.map(ch => (
          <SidebarBtn
            key={ch.id}
            icon={ch.icon || 'fa-tag'}
            label={ch.displayName || ch.name}
            active={inForum && pathname.includes(`channel=${ch.id}`)}
            color={ch.color}
            onClick={() => router.push(`/community?channel=${ch.id}`)}
          />
        ))}

        <div className="sidebar-divider" />

        {/* Chat section */}
        <div className="sidebar-section-title">Channels</div>
        {chatChannels.map(ch => (
          <SidebarBtn
            key={ch.id}
            icon={ch.icon || (ch.type === 'voice' ? 'fa-volume-up' : 'fa-hashtag')}
            label={ch.displayName || ch.name}
            active={inChat && activeChatChannel === ch.id}
            color={ch.color}
            onClick={() => {
              if (onChatChannelSelect) {
                onChatChannelSelect(ch.id);
              } else {
                router.push(`/channels?ch=${ch.id}`);
              }
            }}
          />
        ))}

        <div className="sidebar-divider" />

        {/* Navigation */}
        <div className="sidebar-section-title">Navigate</div>
        <SidebarBtn 
          icon="fa-arrow-left" 
          label="Back to Home" 
          active={pathname === '/'} 
          onClick={() => router.push('/')} 
        />
        <SidebarBtn 
          icon="fa-gauge" 
          label="Dashboard" 
          active={pathname.startsWith('/dashboard')} 
          onClick={() => router.push('/dashboard')} 
        />
        <SidebarBtn 
          icon="fa-home" 
          label="Portfolio" 
          active={false} 
          onClick={() => window.open('https://shanu-fx.web.app', '_blank')} 
        />

        {/* User strip */}
        {user && (
          <div className="sidebar-user mt-auto">
            <AvatarImg src={user.avatar} name={user.displayName} size={32} />
            <div className="min-w-0">
              <div className="sidebar-user-name truncate">
                {user.username}
              </div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
            <div className="sidebar-user-status">
              <div className="nav-online-dot" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarBtn({ icon, label, active, onClick, color }: {
  icon: string; label: string; active: boolean; onClick: () => void; color?: string;
}) {
  return (
    <button className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="sidebar-item-icon">
        <i className={`fas ${icon}`} />
      </span>
      <span className="sidebar-item-label">{label}</span>
      {color && <style jsx>{`
        .sidebar-item { --item-color: ${color}; }
      `}</style>}
    </button>
  );
}
