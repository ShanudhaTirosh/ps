'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { ReactNode } from 'react';

export default function BanGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return children;

  if (user?.isBanned) {
    const isPermanent = user.bannedUntil === 'permanent';
    const banTime = typeof user.bannedUntil === 'number' ? user.bannedUntil : Number(user.bannedUntil);
    const isBanActive = isPermanent || banTime > Date.now();

    if (isBanActive) {
      const expiryDate = isPermanent ? 'Permanent' : new Date(banTime).toLocaleString();

      return (
        <div className="ban-screen">
          <div className="ban-card">
            <div className="ban-icon">
              <i className="fas fa-gavel" />
            </div>
            <h1 className="ban-title">Account Restricted</h1>
            <p className="ban-message">
              Your access to the ShanuFX Community has been suspended due to moderation violations.
            </p>
            <div className="ban-details">
              <div className="ban-detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value text-danger">{isPermanent ? 'Permanently Banned' : 'Temporarily Banned'}</span>
              </div>
              {!isPermanent && (
                <div className="ban-detail-row">
                  <span className="detail-label">Expires:</span>
                  <span className="detail-value text-primary">{expiryDate}</span>
                </div>
              )}
            </div>
            <div className="ban-action">
              <p className="appeal-text">If you believe this was an error, please contact the administrators.</p>
            </div>
          </div>

          <style jsx>{`
            .ban-screen {
              position: fixed;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(10, 10, 15, 0.95);
              backdrop-filter: blur(20px);
              z-index: 99999;
              padding: 1.5rem;
            }
            .ban-card {
              max-width: 480px;
              width: 100%;
              background: rgba(25, 25, 35, 0.45);
              border: 1px solid rgba(255, 102, 0, 0.15);
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 102, 0, 0.05);
              border-radius: 16px;
              padding: 2.5rem;
              text-align: center;
              animation: banFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            @keyframes banFadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .ban-icon {
              width: 80px;
              height: 80px;
              border-radius: 50px;
              background: rgba(255, 68, 68, 0.1);
              border: 1px solid rgba(255, 68, 68, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 2.2rem;
              color: #ff4444;
              margin: 0 auto 1.5rem;
              box-shadow: 0 0 20px rgba(255, 68, 68, 0.15);
              animation: gavelSwing 2s infinite ease-in-out;
            }
            @keyframes gavelSwing {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-15deg); }
            }
            .ban-title {
              font-family: 'Syne', sans-serif;
              font-weight: 800;
              font-size: 1.8rem;
              color: #fff;
              margin-bottom: 0.75rem;
              letter-spacing: -0.5px;
            }
            .ban-message {
              color: var(--text-2, #94a3b8);
              font-size: 0.95rem;
              line-height: 1.6;
              margin-bottom: 2rem;
            }
            .ban-details {
              background: rgba(10, 10, 15, 0.6);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              padding: 1.25rem;
              margin-bottom: 2rem;
              text-align: left;
            }
            .ban-detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.75rem;
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.85rem;
            }
            .ban-detail-row:last-child {
              margin-bottom: 0;
            }
            .detail-label {
              color: var(--text-3, #64748b);
            }
            .detail-value {
              font-weight: 600;
            }
            .text-danger {
              color: #ff4444;
            }
            .text-primary {
              color: var(--primary, #ff6600);
            }
            .appeal-text {
              font-size: 0.8rem;
              color: var(--text-3, #64748b);
            }
          `}</style>
        </div>
      );
    }
  }

  return children;
}
