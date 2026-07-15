'use client';

import { createPost, useChannels } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { processImage } from '@/lib/utils/image';
import { AvatarImg } from '../layout/Navbar';
import { useState, useRef } from 'react';

const FLAIRS = ['Question', 'Showcase', 'Discussion', 'Help', 'Resource', 'Announcement'];

interface Props {
  defaultChannel?: string;
}

export default function PostComposer({ defaultChannel = '' }: Props) {
  const { user } = useAuth();
  const { notify } = useUI();
  const { channels } = useChannels();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [channelId, setChannelId] = useState(defaultChannel);
  const [flair, setFlair] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="composer flex-center text-muted text-sm gap-05">
        <i className="fas fa-lock" />
        Sign in to create a post
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="composer flex items-center gap-1 cursor-pointer" onClick={() => setExpanded(true)}>
        <AvatarImg src={user.avatar || user.photoURL || ''} name={user.displayName || ''} size={36} />
        <div className="composer-placeholder flex-1">
          What&apos;s on your mind? Share a project, ask a question…
        </div>
        <button className="btn-primary btn-sm br-12 composer-post-btn">
          <i className="fas fa-pen" /> Post
        </button>
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingImage(true);
    try {
      const base64 = await processImage(file, 1000, 1000, 0.7);
      setImage(base64);
    } catch (err) {
      console.error(err);
      notify('Failed to process image', 'error');
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    try {
      await createPost({
        channelId: channelId || 'general',
        authorUid: user.uid,
        authorName: user.username || user.displayName,
        authorAvatar: user.avatar || '',
        title: title.trim(),
        body: body.trim(),
        ...(image && { image }),
        ...(flair && { flair }),
      });
      setTitle(''); 
      setBody(''); 
      setImage(null);
      setFlair(''); 
      setExpanded(false); 
      notify('Post created successfully!', 'success');
    } catch (err) {
      console.error('Create Post Error:', err);
      notify('Failed to create post', 'error');
    } finally { setLoading(false); }
  };

  const forumChannels = channels.filter(c => c.type === 'forum');

  return (
    <div className="composer">
      <div className="composer-title">Create a post</div>

      <input
        className="composer-input"
        placeholder="Post title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={200}
        title="Post Title"
      />

      <textarea
        className="composer-input resize-v"
        placeholder="Write your post body… (required)"
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={5}
        title="Post Body"
      />

      {image && (
        <div className="composer-image-preview">
          <img src={image} alt="Preview" />
          <button className="composer-image-remove" onClick={() => setImage(null)} title="Remove image preview">
            <i className="fas fa-times" />
          </button>
        </div>
      )}

      {processingImage && (
        <div className="flex-center py-1rem text-muted text-sm gap-05">
          <i className="fas fa-spinner fa-spin" /> Processing image…
        </div>
      )}

      <div className="composer-row">
        {/* Channel selector */}
        {forumChannels.length > 0 && (
          <select 
            className="composer-select" 
            value={channelId} 
            onChange={e => setChannelId(e.target.value)}
            title="Select Channel"
          >
            <option value="">No channel</option>
            {forumChannels.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.displayName || ch.name}</option>
            ))}
          </select>
        )}

        {/* Flair */}
        <select 
          className="composer-select" 
          value={flair} 
          onChange={e => setFlair(e.target.value)}
          title="Select Flair"
        >
          <option value="">No flair</option>
          {FLAIRS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <div className="flex-1" />

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          title="Attach an image"
          aria-label="Upload post image"
        />
        <button 
          className="btn-outline btn-sm br-8" 
          onClick={() => fileInputRef.current?.click()}
          disabled={processingImage || !!image}
          title="Add Image"
        >
          <i className="fas fa-image" />
        </button>

        <button className="btn-outline btn-sm br-8" onClick={() => setExpanded(false)}>
          Cancel
        </button>
        <button
          className="btn-primary btn-sm"
          onClick={handleSubmit}
          disabled={loading || processingImage || !title.trim() || !body.trim()}
        >
          {loading ? <><i className="fas fa-spinner fa-spin" /> Posting…</> : <><i className="fas fa-paper-plane" /> Post</>}
        </button>
      </div>

      <style jsx>{`
        .composer-post-btn { padding: 0.6rem 1.25rem; }
        .composer-image-preview {
          position: relative; margin-top: 1rem; border-radius: 12px; overflow: hidden;
          max-height: 300px; border: 1px solid var(--border);
        }
        .composer-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .composer-image-remove {
          position: absolute; top: 0.5rem; right: 0.5rem;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(0,0,0,0.5); border: none; color: #fff;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .composer-image-remove:hover { background: var(--danger); }
        .hidden { display: none; }
        .py-1rem { padding: 1rem 0; }
      `}</style>
    </div>
  );
}
