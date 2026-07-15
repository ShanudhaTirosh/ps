'use client';

import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/lib/types';
import { createComment } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/context/AuthContext';
import { useUI } from '@/lib/context/UIContext';
import { AvatarImg } from '../layout/Navbar';
import { processImage } from '@/lib/utils/image';

interface Props {
  postId: string;
  comments: Comment[];
}

function formatTs(ts: unknown): string {
  try {
    if (!ts) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (ts as any).toDate ? (ts as any).toDate() : new Date(ts as number);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch { return ''; }
}

export default function CommentThread({ postId, comments }: Props) {
  const { user } = useAuth();
  const { confirm } = useUI();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null); // parentId of comment (always a root comment ID)
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null); // specific comment being replied to
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);

  const rootComments = comments.filter(c => !c.parentId);
  const replies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  const handleSubmit = async (parentId?: string) => {
    const body = parentId ? replyText.trim() : text.trim();
    const commentImg = parentId ? replyImage : image;
    if ((!body && !commentImg) || !user) return;
    setLoading(true);
    try {
      await createComment({
        postId,
        authorUid: user.uid,
        authorName: user.username || user.displayName,
        authorAvatar: user.avatar || '',
        body,
        ...(parentId && { parentId }),
        ...(parentId && replyToComment && replyToComment.id !== parentId && {
          replyTo: {
            id: replyToComment.id,
            authorName: replyToComment.authorName,
            body: replyToComment.body,
          }
        }),
        ...(commentImg && { image: commentImg }),
      });
      if (parentId) {
        setReplyTo(null);
        setReplyToComment(null);
        setReplyText('');
        setReplyImage(null);
      } else {
        setText('');
        setImage(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (file: File, isReply: boolean) => {
    setProcessing(true);
    try {
      const base64 = await processImage(file, 1280, 1280);
      if (isReply) setReplyImage(base64);
      else setImage(base64);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* Top-level comment box */}
      {user && (
        <div className="composer main-composer">
          <textarea
            className="composer-input"
            placeholder="Write a comment…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            title="Write a comment"
            aria-label="New comment text"
          />
          <div className="composer-actions">
            <input type="file" ref={mainFileRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0], false)} title="Attachment upload" />
            <button className="btn-outline btn-sm br-8" onClick={() => mainFileRef.current?.click()} disabled={processing || !!image} title="Add Image">
              <i className="fas fa-image" />
            </button>
            <button className="btn-primary btn-sm" onClick={() => handleSubmit()} disabled={loading || processing || (!text.trim() && !image)}>
              {loading ? 'Posting…' : <><i className="fas fa-paper-plane" /> Comment</>}
            </button>
          </div>
          {image && (
            <div className="comment-img-preview">
              <img src={image} alt="Preview" />
              <button className="img-remove" onClick={() => setImage(null)} title="Remove preview"><i className="fas fa-times" /></button>
            </div>
          )}
        </div>
      )}

      {/* Comment count */}
      <div className="comment-stats">
        {comments.length} comment{comments.length !== 1 ? 's' : ''}
      </div>

      {/* Comments */}
      <div className="comment-thread">
        {rootComments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-comment" /></div>
            <h3>No comments yet</h3>
            <p>Be the first to comment.</p>
          </div>
        )}
        {rootComments.map(comment => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={() => {
                if (replyTo === comment.id && replyToComment?.id === comment.id) {
                  setReplyTo(null);
                  setReplyToComment(null);
                } else {
                  setReplyTo(comment.id);
                  setReplyToComment(comment);
                }
              }}
            />
            {/* Reply box */}
            {replyTo === comment.id && user && (
              <div className="comment-nested reply-box-nested">
                <textarea
                  className="composer-input"
                  placeholder={replyToComment ? `Reply to ${replyToComment.authorName}…` : `Reply…`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={2}
                  title={replyToComment ? `Reply to ${replyToComment.authorName}` : `Reply`}
                  aria-label="Reply text"
                />
                <div className="composer-actions">
                  <input type="file" ref={replyFileRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0], true)} title="Reply attachment upload" />
                  <button className="btn-outline btn-sm br-8" onClick={() => replyFileRef.current?.click()} disabled={processing || !!replyImage} title="Add Image">
                    <i className="fas fa-image" />
                  </button>
                  <button className="btn-outline btn-sm br-8" onClick={() => { setReplyTo(null); setReplyToComment(null); setReplyImage(null); setReplyText(''); }}>Cancel</button>
                  <button className="btn-primary btn-sm" onClick={() => handleSubmit(comment.id)} disabled={processing || (!replyText.trim() && !replyImage)}>Reply</button>
                </div>
                {replyImage && (
                  <div className="comment-img-preview">
                    <img src={replyImage} alt="Preview" />
                    <button className="img-remove" onClick={() => setReplyImage(null)} title="Remove reply preview"><i className="fas fa-times" /></button>
                  </div>
                )}
              </div>
            )}
            {/* Nested replies */}
            {replies(comment.id).length > 0 && (
              <div className="comment-nested">
                {replies(comment.id).map(reply => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    onReply={() => {
                      if (replyTo === comment.id && replyToComment?.id === reply.id) {
                        setReplyTo(null);
                        setReplyToComment(null);
                      } else {
                        setReplyTo(comment.id);
                        setReplyToComment(reply);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .main-composer { margin-bottom: 1rem; }
        .composer-actions { display: flex; gap: 0.75rem; justify-content: flex-end; align-items: center; }
        .comment-stats {
          font-size: 0.85rem; color: var(--text-3); margin-bottom: 0.75rem; 
          font-family: 'JetBrains Mono', monospace;
        }
        .reply-box-nested { margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .hidden { display: none; }
        .comment-img-preview {
          position: relative; margin-top: 0.5rem; border-radius: 8px; overflow: hidden;
          max-height: 150px; border: 1px solid var(--border); width: fit-content;
        }
        .comment-img-preview img { height: 100%; max-width: 200px; object-fit: cover; }
        .img-remove {
          position: absolute; top: 0.25rem; right: 0.25rem; width: 20px; height: 20px;
          border-radius: 50%; background: rgba(0,0,0,0.5); border: none; color: #fff;
          font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
      `}</style>
    </div>
  );
}

function CommentItem({ comment, onReply }: { comment: Comment; onReply?: () => void }) {
  const { user } = useAuth();
  const { confirm } = useUI();
  return (
    <div className="comment-card">
      <AvatarImg src={comment.authorAvatar} name={comment.authorName} size={32} />
      <div className="comment-body">
        {comment.replyTo && (
          <div className="comment-reply-quoted">
            <i className="fas fa-reply" />
            Replying to <span className="reply-user">@{comment.replyTo.authorName}</span>: <span className="reply-body-snippet">"{comment.replyTo.body}"</span>
          </div>
        )}
        <div className="comment-header">
          <span className="comment-author">{comment.authorName}</span>
          <span className="comment-time">{formatTs(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.body}</p>
        {comment.image && (
          <div className="comment-attached-img">
            <img src={comment.image} alt="Comment attachment" />
          </div>
        )}
        <div className="comment-actions">
          {onReply && (
            <button className="comment-reply-btn" onClick={onReply}>
              <i className="fas fa-reply" /> Reply
            </button>
          )}
          {(user?.uid === comment.authorUid || user?.role === 'admin' || user?.role === 'primary') && (
            <button className="comment-reply-btn btn-danger-hover" onClick={() => {
              confirm({
                title: 'Delete Comment',
                message: 'Delete this comment permanently?',
                confirmText: 'Delete',
                onConfirm: () => {
                  import('@/lib/hooks/usePosts').then(m => m.deleteComment(comment.id, comment.postId, comment.authorUid));
                }
              });
            }} title="Delete comment">
              <i className="fas fa-trash" />
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .comment-attached-img {
          margin: 0.5rem 0; border-radius: 8px; overflow: hidden;
          border: 1px solid var(--border); max-width: 400px;
        }
        .comment-attached-img img { width: 100%; height: auto; }
        .comment-actions { display: flex; gap: 1rem; margin-top: 0.25rem; }
        .btn-danger-hover:hover { color: var(--danger) !important; background: rgba(239, 68, 68, 0.1); }
        
        .comment-reply-quoted {
          font-size: 0.76rem;
          color: var(--text-2);
          margin-bottom: 0.4rem;
          opacity: 0.85;
          display: flex;
          align-items: center;
          border-left: 2px solid var(--border-h);
          padding-left: 0.5rem;
        }
        .comment-reply-quoted i {
          margin-right: 0.3rem;
          transform: scaleX(-1);
        }
        .comment-reply-quoted .reply-user {
          font-weight: 700;
          color: var(--primary-light);
          margin-right: 0.25rem;
        }
        .reply-body-snippet {
          font-style: italic;
          color: var(--text-3);
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
