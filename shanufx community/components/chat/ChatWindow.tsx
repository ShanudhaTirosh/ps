'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChat, useTyping } from '@/lib/hooks/useChat';
import { useAuth } from '@/lib/context/AuthContext';
import { AvatarImg } from '../layout/Navbar';
import type { ChatMessage } from '@/lib/types';
import { processImage } from '@/lib/utils/image';

interface Props {
  channelId: string;
  channelName: string;
  channelDesc?: string;
}

function groupMessages(msgs: ChatMessage[]) {
  const groups: ChatMessage[][] = [];
  let currentGroup: ChatMessage[] = [];
  msgs.forEach((msg, i) => {
    const prev = msgs[i - 1];
    const sameAuthor = prev?.authorUid === msg.authorUid;
    const within5min = prev && (msg.createdAt - prev.createdAt) < 5 * 60 * 1000;
    const isReply = !!msg.replyTo;
    const prevIsReply = !!prev?.replyTo;

    if (sameAuthor && within5min && !isReply && !prevIsReply) {
      currentGroup.push(msg);
    } else {
      if (currentGroup.length) groups.push(currentGroup);
      currentGroup = [msg];
    }
  });
  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

export default function ChatWindow({ channelId, channelName, channelDesc }: Props) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(channelId);
  const { typingUsers, setTyping, clearTyping } = useTyping(channelId, user?.uid || '');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Staged attachments/replying states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [replyToMsg, setReplyToMsg] = useState<ChatMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingImage(true);
    try {
      const base64 = await processImage(file, 1280, 1280, 0.8);
      setImagePreview(base64);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !imagePreview) || !user || sending || processingImage) return;
    const text = input.trim();
    const image = imagePreview || undefined;
    const replyTo = replyToMsg ? {
      id: replyToMsg.id,
      authorName: replyToMsg.authorName,
      text: replyToMsg.text,
      image: replyToMsg.image,
    } : undefined;

    setInput('');
    setImagePreview(null);
    setReplyToMsg(null);
    setSending(true);
    await clearTyping();
    await sendMessage({
      authorUid: user.uid,
      authorName: user.username || user.displayName,
      authorAvatar: user.avatar || '',
      text,
      image,
      replyTo,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (user && e.target.value.trim()) {
      setTyping(user.username || user.displayName);
    } else if (user) {
      clearTyping();
    }
  };

  const typingNames = Object.values(typingUsers);
  const typingText = typingNames.length === 0 ? '' :
    typingNames.length === 1 ? `${typingNames[0]} is typing…` :
    typingNames.length === 2 ? `${typingNames[0]} and ${typingNames[1]} are typing…` :
    'Several people are typing…';

  const groups = groupMessages(messages);

  return (
    <div className="chat-shell">
      {/* Header */}
      <div className="chat-header">
        <i className="fas fa-hashtag chat-header-hashtag" />
        <div>
          <div className="chat-header-name">{channelName}</div>
          {channelDesc && <div className="chat-header-desc">{channelDesc}</div>}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading-container">
            <i className="fas fa-spinner fa-spin chat-loading-spinner" /> Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="chat-welcome-hand">👋</div>
            <h3>Welcome to #{channelName}</h3>
            <p>This is the beginning of the #{channelName} channel. Be the first to send a message!</p>
          </div>
        ) : (
          groups.map((group, gi) => {
            const first = group[0];
            return (
              <div key={first.id} className="chat-group">
                {/* First message in group shows avatar + header */}
                <div className="chat-msg-row">
                  <AvatarImg src={first.authorAvatar} name={first.authorName} size={36} />
                  <div className="chat-msg-body">
                    {first.replyTo && (
                      <div className="chat-reply-quoted">
                        <i className="fas fa-reply" />
                        Replying to <span className="reply-user">@{first.replyTo.authorName}</span>: {first.replyTo.text || (first.replyTo.image ? '[Image]' : '')}
                      </div>
                    )}
                    <div className="chat-msg-header">
                      <span className={`chat-msg-name ${first.authorUid === user?.uid ? 'primary-user' : ''}`}>
                        {first.authorName}
                      </span>
                      <span className="chat-msg-time">
                        {formatDistanceToNow(first.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    {first.text && <div className="chat-msg-text">{first.text}</div>}
                    {first.image && (
                      <div className="chat-msg-image-wrap">
                        <img src={first.image} alt="Attachment" className="chat-msg-image" />
                      </div>
                    )}
                  </div>
                  {user && (
                    <div className="msg-actions">
                      <button 
                        className="msg-action-btn" 
                        title="Reply" 
                        onClick={() => setReplyToMsg(first)}
                      >
                        <i className="fas fa-reply" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Subsequent messages in group: no avatar/header */}
                {group.slice(1).map(msg => (
                  <div key={msg.id} className="chat-msg-row">
                    <div className="chat-avatar-spacer" />
                    <div className="chat-msg-body">
                      {msg.replyTo && (
                        <div className="chat-reply-quoted">
                          <i className="fas fa-reply" />
                          Replying to <span className="reply-user">@{msg.replyTo.authorName}</span>: {msg.replyTo.text || (msg.replyTo.image ? '[Image]' : '')}
                        </div>
                      )}
                      {msg.text && <div className="chat-msg-text">{msg.text}</div>}
                      {msg.image && (
                        <div className="chat-msg-image-wrap">
                          <img src={msg.image} alt="Attachment" className="chat-msg-image" />
                        </div>
                      )}
                    </div>
                    {user && (
                      <div className="msg-actions">
                        <button 
                          className="msg-action-btn" 
                          title="Reply" 
                          onClick={() => setReplyToMsg(msg)}
                        >
                          <i className="fas fa-reply" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      <div className="typing-indicator">{typingText}</div>

      {/* Input */}
      <div className="chat-input-area">
        {!user ? (
          <div className="chat-signin-required">
            <i className="fas fa-lock chat-lock-icon" />
            Sign in to send messages
          </div>
        ) : (
          <div className="chat-composer-container">
            {replyToMsg && (
              <div className="chat-reply-preview">
                <div className="reply-preview-text">
                  <i className="fas fa-reply reply-preview-icon" />
                  Replying to <span className="reply-preview-user">@{replyToMsg.authorName}</span>: {replyToMsg.text || (replyToMsg.image ? '[Image]' : '')}
                </div>
                <button className="reply-preview-close" onClick={() => setReplyToMsg(null)} title="Cancel reply">
                  <i className="fas fa-times" />
                </button>
              </div>
            )}

            {imagePreview && (
              <div className="chat-image-preview-wrap">
                <div className="chat-image-preview">
                  <img src={imagePreview} alt="Upload preview" />
                  <button className="chat-image-preview-remove" onClick={() => setImagePreview(null)} title="Remove image">
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            )}

            <div className="chat-input-box">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
                title="Upload image"
              />
              <button 
                className="chat-image-btn" 
                onClick={() => fileInputRef.current?.click()}
                disabled={sending || processingImage}
                title="Add Image"
              >
                {processingImage ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-image" />}
              </button>

              <input
                ref={inputRef}
                className="chat-input"
                placeholder={replyToMsg ? `Reply to @${replyToMsg.authorName}...` : `Message #${channelName}`}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={2000}
              />
              <button 
                className="chat-send-btn" 
                onClick={handleSend} 
                disabled={(!input.trim() && !imagePreview) || sending || processingImage}
                title="Send Message"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-composer-container {
          display: flex;
          flex-direction: column;
          background: rgba(4, 4, 10, 0.3);
          border-radius: 14px;
          padding: 0.5rem;
          border: 1px solid var(--border);
        }
        .chat-input-box {
          border: none !important;
          background: transparent !important;
          padding: 0.25rem 0.5rem !important;
        }
        .chat-reply-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.75rem;
          background: rgba(124, 58, 237, 0.08);
          border-radius: 8px;
          margin-bottom: 0.4rem;
          border-left: 3px solid var(--primary);
        }
        .reply-preview-text {
          font-size: 0.78rem;
          color: var(--text-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .reply-preview-user {
          font-weight: 700;
          color: var(--primary-light);
        }
        .reply-preview-close {
          background: none;
          border: none;
          color: var(--text-3);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.1rem 0.3rem;
          transition: color 0.2s;
        }
        .reply-preview-close:hover {
          color: var(--danger);
        }

        .chat-image-preview-wrap {
          display: flex;
          padding: 0.4rem;
          margin-bottom: 0.4rem;
        }
        .chat-image-preview {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.2);
        }
        .chat-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .chat-image-preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 0.7rem;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 5;
        }
        .chat-image-preview-remove:hover {
          background: var(--danger);
        }

        .chat-image-btn {
          background: transparent;
          border: none;
          color: var(--text-2);
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .chat-image-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--primary-light);
        }
        
        .chat-reply-quoted {
          font-size: 0.74rem;
          color: var(--text-2);
          margin-bottom: 0.4rem;
          opacity: 0.85;
          display: flex;
          align-items: center;
          border-left: 2px solid var(--border-h);
          padding-left: 0.5rem;
        }
        .chat-reply-quoted .reply-user {
          font-weight: 700;
          color: var(--primary-light);
          margin-right: 0.25rem;
        }
        .chat-reply-quoted i {
          margin-right: 0.3rem;
        }

        .chat-msg-image-wrap {
          margin-top: 0.5rem;
          max-width: 320px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .chat-msg-image-wrap:hover {
          transform: scale(1.01);
          border-color: var(--primary-light);
        }
        .chat-msg-image {
          width: 100%;
          max-height: 240px;
          object-fit: contain;
          display: block;
        }
        .hidden {
          display: none;
        }

        .chat-header-hashtag {
          font-size: 0.9rem;
          color: var(--text-3);
        }
        .chat-loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: var(--text-3);
          font-size: 0.82rem;
        }
        .chat-loading-spinner {
          margin-right: 0.4rem;
        }
        .chat-welcome-hand {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .chat-signin-required {
          text-align: center;
          color: var(--text-3);
          font-size: 0.82rem;
          padding: 0.5rem;
        }
        .chat-lock-icon {
          margin-right: 0.4rem;
        }
        .reply-preview-icon {
          margin-right: 0.4rem;
          color: var(--primary-light);
        }
      `}</style>
    </div>
  );
}
