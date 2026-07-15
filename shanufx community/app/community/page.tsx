'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import LoginModal from '@/components/auth/LoginModal';
import PostCard from '@/components/community/PostCard';
import PostComposer from '@/components/community/PostComposer';
import CommentThread from '@/components/community/CommentThread';
import { usePosts, usePost, votePost, getUserVote } from '@/lib/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { AvatarImg } from '@/components/layout/Navbar';

const SORT_OPTIONS = ['New', 'Top', 'Hot'];

function formatTs(ts: unknown): string {
  try {
    if (!ts) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (ts as any).toDate ? (ts as any).toDate() : new Date(ts as number);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch { return ''; }
}

function PostDetailView({ postId, onBack }: { postId: string; onBack: () => void }) {
  const { user } = useAuth();
  const { notify, confirm } = useUI();
  const { post, comments, loading } = usePost(postId);
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(null);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    if (post) setLocalScore(post.upvotes - post.downvotes);
  }, [post]);

  useEffect(() => {
    if (user && postId) getUserVote(postId, user.uid).then(setMyVote);
  }, [postId, user]);

  const handleVote = async (dir: 'up' | 'down') => {
    if (!user || !post) return;
    const prev = myVote;
    const isUndo = prev === dir;
    setMyVote(isUndo ? null : dir);
    
    let diff = 0;
    if (dir === 'up') {
      diff = isUndo ? -1 : (prev === 'down' ? 2 : 1);
    } else {
      diff = isUndo ? 1 : (prev === 'up' ? -2 : -1);
    }
    setLocalScore(s => s + diff);
    await votePost(postId, user.uid, dir, post.authorUid);
  };

  const handleSave = async () => {
    if (!user || !post) return;
    const isSaved = user.savedPosts?.includes(post.id);
    import('@/lib/hooks/usePosts').then(m => m.savePost(user.uid, post.id, !isSaved));
    notify(isSaved ? 'Post removed from saved' : 'Post saved successfully', 'success');
  };

  const handleReport = () => {
    if (!post) return;
    confirm({
      title: 'Report Post',
      message: 'Are you sure you want to report this post?',
      confirmText: 'Report',
      onConfirm: () => {
        import('@/lib/hooks/usePosts').then(m => m.reportPost(post.id));
        notify('Reported', 'info');
      }
    });
  };

  if (loading) return (
    <div className="post-detail">
      <div className="text-muted text-sm"><i className="fas fa-spinner fa-spin" /> Loading post…</div>
    </div>
  );
  if (!post) return (
    <div className="post-detail">
      <button className="back-btn" onClick={onBack}><i className="fas fa-arrow-left" /> Back</button>
      <div className="empty-state"><div className="empty-state-icon"><i className="fas fa-ghost" /></div><h3>Post not found</h3></div>
    </div>
  );

  const isSaved = user?.savedPosts?.includes(post.id);

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onBack}><i className="fas fa-arrow-left" /> Back to feed</button>

      <div className="post-detail-card reddit-layout">
        <div className="vote-sidebar">
          <button className={`vote-icon-btn ${myVote === 'up' ? 'voted-up' : ''}`} onClick={() => handleVote('up')} title="Upvote">
            <i className="fas fa-chevron-up" />
          </button>
          <span className={`vote-count-small ${localScore > 0 ? 'score-pos' : localScore < 0 ? 'score-neg' : 'score-neu'}`}>{localScore}</span>
          <button className={`vote-icon-btn ${myVote === 'down' ? 'voted-down' : ''}`} onClick={() => handleVote('down')} title="Downvote">
            <i className="fas fa-chevron-down" />
          </button>
        </div>
        <div className="post-content-area">
          <div className="post-meta">
            <AvatarImg src={post.authorAvatar} name={post.authorName} size={28} />
            <span className="post-author">{post.authorName}</span>
            <span className="post-time">{formatTs(post.createdAt)}</span>
            {post.channelId && <span className="post-channel-tag">#{post.channelId}</span>}
            {post.flair && <span className="post-flair">{post.flair}</span>}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <p className="post-detail-body">{post.body}</p>
          {post.image && (
            <div className="post-detail-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}
          <div className="post-footer mt-125rem">
            <div className="post-comment-count"><i className="fas fa-comment" /> {post.commentCount} comments</div>
            
            <button className={`vote-btn ${isSaved ? 'text-primary' : ''}`} onClick={handleSave} title="Save post">
              <i className={`fa${isSaved ? 's' : 'r'} fa-bookmark`} /> {isSaved ? 'Saved' : 'Save'}
            </button>

            <button className="vote-btn" onClick={handleReport} title="Report post">
              <i className="fas fa-flag" /> Report
            </button>

            <button className="vote-btn" onClick={() => navigator.clipboard.writeText(window.location.href)} title="Copy link">
              <i className="fas fa-link" /> Share
            </button>
          </div>
        </div>
      </div>

      <CommentThread postId={postId} comments={comments} />
      <style jsx>{`
        .post-detail-card { display: flex; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 2rem; }
        .post-detail-image { margin: 1.5rem 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        .post-detail-image img { width: 100%; height: auto; display: block; }
        .vote-sidebar { width: 48px; background: rgba(255,255,255,0.02); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 1.5rem 0; }
        .post-content-area { flex: 1; padding: 1.5rem 2rem; }
        .vote-icon-btn { background: none; border: none; color: var(--text-3); cursor: pointer; font-size: 1.25rem; padding: 0.4rem; transition: all 0.2s; }
        .vote-icon-btn:hover { color: var(--primary); transform: scale(1.1); }
        .vote-icon-btn.voted-up { color: var(--green); }
        .vote-icon-btn.voted-down { color: var(--danger); }
        .vote-count-small { font-size: 0.9rem; font-weight: 800; margin: 0.4rem 0; font-family: 'JetBrains Mono', monospace; }
        .score-pos { color: var(--green); }
        .score-neg { color: var(--danger); }
        .score-neu { color: var(--text-2); }
      `}</style>
    </div>
  );
}

function ForumFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [sort, setSort] = useState('New');

  const channelFilter = searchParams.get('channel') || undefined;
  const postId = searchParams.get('post') || '';

  const { posts, loading } = usePosts(channelFilter);

  const sorted = [...posts].sort((a, b) => {
    if (sort === 'Top') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sort === 'Hot') return (b.commentCount + b.upvotes) - (a.commentCount + a.upvotes);
    return 0; // New — already ordered by createdAt desc from Firestore
  });

  return (
    <>
      <div className="app-shell">
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <Sidebar />
        <div className="app-content">
          {postId ? (
            <PostDetailView postId={postId} onBack={() => router.push('/community')} />
          ) : (
            <div className="feed">
              <div className="feed-header">
                <div>
                  <h2 className="feed-title">
                    {channelFilter ? `#${channelFilter}` : 'All Posts'}
                  </h2>
                  <div className="text-muted mt-02rem fs-078rem">
                    {posts.length} post{posts.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="feed-filters">
                  {SORT_OPTIONS.map(s => (
                    <button
                      key={s}
                      className={`feed-filter-btn ${sort === s ? 'active' : ''}`}
                      onClick={() => setSort(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <PostComposer defaultChannel={channelFilter} />

              {loading ? (
                <div className="empty-state">
                  <i className="fas fa-spinner fa-spin fs-15 mb-075rem text-primary" />
                  <p>Loading posts…</p>
                </div>
              ) : sorted.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="fas fa-layer-group" /></div>
                  <h3>No posts yet</h3>
                  <p>Be the first to post something!</p>
                </div>
              ) : (
                sorted.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => router.push(`/community?post=${post.id}`)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spin" /></div>}>
      <ForumFeed />
    </Suspense>
  );
}
