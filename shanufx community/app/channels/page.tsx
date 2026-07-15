'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar, { STATIC_CHAT } from '@/components/layout/Sidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import VoiceRoom from '@/components/chat/VoiceRoom';
import LoginModal from '@/components/auth/LoginModal';
import { useChannels } from '@/lib/hooks/usePosts';

function ChannelsInner() {
  const searchParams = useSearchParams();
  const initChannel = searchParams.get('ch') || 'general';
  const [activeChannel, setActiveChannel] = useState(initChannel);
  const [showLogin, setShowLogin] = useState(false);
  const { channels } = useChannels();

  const allChannels = channels.length > 0 ? channels : STATIC_CHAT;
  const currentCh = allChannels.find(c => c.id === activeChannel) || allChannels[0];

  return (
    <>
      <div className="app-shell">
        <Navbar onLoginClick={() => setShowLogin(true)} />

        {/* Global Sidebar component */}
        <Sidebar activeChatChannel={activeChannel} onChatChannelSelect={setActiveChannel} />

        {/* Main content */}
        <div className="app-content">
          {currentCh ? (
            currentCh.type === 'voice' ? (
              <VoiceRoom 
                channelId={currentCh.id} 
                channelName={currentCh.displayName || currentCh.name} 
                isLocked={currentCh.isLocked}
              />
            ) : (
              <ChatWindow
                channelId={currentCh.id}
                channelName={currentCh.name}
                channelDesc={currentCh.description}
              />
            )
          ) : (
            <div className="empty-state pt-4rem">
              <div className="empty-state-icon"><i className="fas fa-comments" /></div>
              <h3>Select a channel</h3>
              <p>Choose a channel from the sidebar to start chatting.</p>
            </div>
          )}
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default function ChannelsPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spin" /></div>}>
      <ChannelsInner />
    </Suspense>
  );
}
