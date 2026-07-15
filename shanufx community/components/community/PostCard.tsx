'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/lib/types';
import { votePost, getUserVote } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { AvatarImg } from '../layout/Navbar';

interface Props {
  post: Post;
  onClick: () => void;
}

function formatTs(ts: unknown): string {
  try {
    if (!ts) return '';
    // Firestore Timestamp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (ts as any).toDate ? (ts as any).toDate() : new Date(ts as number);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch { return ''; }
}

export default function PostCard({ post, onClick }: Props) {
  const { user } = useAuth();
  const { notify, confirm } = useUI();
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(null);
  const [localUp, setLocalUp] = useState(post.upvotes);
  const [localDown, setLocalDown] = useState(post.downvotes);

  useEffect(() => {
    if (!user) return;
    getUserVote(post.id, user.uid).then(setMyVote);
  }, [post.id, user]);

  const handleVote = async (e: React.MouseEvent, dir: 'up' | 'down') => {
    e.stopPropagation();
    if (!user) return;
    const prev = myVote;
    const isUndo = prev === dir;
    setMyVote(isUndo ? null : dir);
    
    let upDiff = 0;
    let downDiff = 0;
    
    if (dir === 'up') {
      upDiff = isUndo ? -1 : (prev === 'down' ? 1 : 1);
      if (prev === 'down') downDiff = -1;
    } else {
      downDiff = isUndo ? -1 : (prev === 'up' ? 1 : 1);
      if (prev === 'up') upDiff = -1;
    }
    
    setLocalUp(v => v + upDiff);
    setLocalDown(v => v + downDiff);
    await votePost(post.id, user.uid, dir, post.authorUid);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const isSaved = user.savedPosts?.includes(post.id);
    import('@/lib/hooks/usePosts').then(m => m.savePost(user.uid, post.id, !isSaved));
    notify(isSaved ? 'Post removed from saved' : 'Post saved successfully', 'success');
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirm({
      title: 'Report Post',
      message: 'Are you sure you want to report this post for moderation?',
      confirmText: 'Report',
      onConfirm: () => {
        import('@/lib/hooks/usePosts').then(m => m.reportPost(post.id));
        notify('Post reported', 'info');
      }
    });
  };

  const score = localUp - localDown;
  const isSaved = user?.savedPosts?.includes(post.id);

  return (
    <div className="post-card reddit-layout">
      {/* Vote Sidebar */}
      <div className="vote-sidebar">
        <button 
          className={`vote-icon-btn ${myVote === 'up' ? 'voted-up' : ''}`} 
          onClick={e => handleVote(e, 'up')}
          title="Upvote"
        >
          <i className="fas fa-chevron-up" />
        </button>
        <span className={`vote-count-small ${score > 0 ? 'score-pos' : score < 0 ? 'score-neg' : 'score-neu'}`}>
          {score}
        </span>
        <button 
          className={`vote-icon-btn ${myVote === 'down' ? 'voted-down' : ''}`} 
          onClick={e => handleVote(e, 'down')}
          title="Downvote"
        >
          <i className="fas fa-chevron-down" />
        </button>
      </div>

      <div className="post-content-area">
        <div className="post-card-clickable" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
          {/* Meta row */}
          <div className="post-meta">
            <AvatarImg src={post.authorAvatar} name={post.authorName} size={24} />
            <span className="post-author">{post.authorName}</span>
            <span className="post-time">{formatTs(post.createdAt)}</span>
            {post.channelId && post.channelId !== 'all' && (
              <span className="post-channel-tag">#{post.channelId}</span>
            )}
            {post.flair && <span className="post-flair">{post.flair}</span>}
          </div>

          {/* Title */}
          <h3 className="post-title">{post.title}</h3>

          {/* Body preview */}
          <p className="post-body">{post.body}</p>

          {/* Image if exists */}
          {post.image && (
            <div className="post-image-wrap">
              <img src={post.image} alt={post.title} className="post-image-content" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="post-footer">
          {/* Comment count */}
          <div className="post-comment-count">
            <i className="fas fa-comment" />
            {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}
          </div>

          <button className={`vote-btn ${isSaved ? 'text-primary' : ''}`} onClick={handleSave} title="Save post">
            <i className={`fa${isSaved ? 's' : 'r'} fa-bookmark`} /> {isSaved ? 'Saved' : 'Save'}
          </button>

          <button className="vote-btn" onClick={handleReport} title="Report post">
            <i className="fas fa-flag" /> Report
          </button>

          {/* Share placeholder */}
          <button className="vote-btn" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin + '/community/' + post.id); }}
            title="Copy link">
            <i className="fas fa-link" /> Share
          </button>

          {/* Delete button */}
          {(user?.uid === post.authorUid || user?.role === 'admin' || user?.role === 'primary') && (
            <button className="vote-btn btn-danger-hover" onClick={e => {
              e.stopPropagation();
              confirm({
                title: 'Delete Post',
                message: 'Delete this post permanently? This cannot be undone.',
                confirmText: 'Delete',
                onConfirm: () => {
                  import('@/lib/hooks/usePosts').then(m => m.deletePost(post.id, post.authorUid));
                }
              });
            }} title="Delete post">
              <i className="fas fa-trash" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .reddit-layout { display: flex; gap: 0; padding: 0; overflow: hidden; }
        .vote-sidebar {
          width: 44px; padding: 0.75rem 0.25rem; display: flex; flex-direction: column;
          align-items: center; background: rgba(255,255,255,0.02); border-right: 1px solid var(--border);
        }
        .vote-icon-btn {
          background: none; border: none; color: var(--text-3); cursor: pointer;
          font-size: 1.1rem; padding: 0.25rem; transition: all 0.2s;
        }
        .vote-icon-btn:hover { color: var(--primary); transform: scale(1.15); }
        .vote-icon-btn.voted-up { color: var(--green); }
        .vote-icon-btn.voted-down { color: var(--danger); }
        
        .vote-count-small { font-size: 0.8rem; font-weight: 800; margin: 0.2rem 0; font-family: 'JetBrains Mono', monospace; }
        .score-pos { color: var(--green); }
        .score-neg { color: var(--danger); }
        .score-neu { color: var(--text-3); }

        .post-content-area { flex: 1; padding: 1rem 1.25rem; display: flex; flex-direction: column; }
        .post-card-clickable { cursor: pointer; outline: none; }
        .post-image-wrap { 
          margin: 1rem 0; border-radius: 12px; overflow: hidden; 
          border: 1px solid var(--border); max-height: 400px;
        }
        .post-image-content { width: 100%; height: 100%; object-fit: cover; }
        .btn-danger-hover:hover { color: var(--danger) !important; background: rgba(239, 68, 68, 0.1); }
        
        .post-meta { margin-bottom: 0.5rem; display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
        .post-title { margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 700; color: #fff; line-height: 1.3; }
        .post-body { color: var(--text-2); font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
