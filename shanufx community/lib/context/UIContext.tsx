'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UIContextType {
  notify: (message: string, type?: Notification['type']) => void;
  confirm: (options: ConfirmOptions) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);

  const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const handleConfirm = () => {
    if (confirmModal) {
      confirmModal.onConfirm();
      setConfirmModal(null);
    }
  };

  const handleCancel = () => {
    if (confirmModal) {
      if (confirmModal.onCancel) confirmModal.onCancel();
      setConfirmModal(null);
    }
  };

  return (
    <UIContext.Provider value={{ notify, confirm }}>
      {children}
      
      {/* Notifications Portal */}
      <div className="notifications-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification-toast ${n.type}`}>
            <i className={`fas ${n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`} />
            <span>{n.message}</span>
            <button className="notif-close" onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}>&times;</button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-card">
            <div className="confirm-modal-header">
              <i className="fas fa-question-circle confirm-modal-icon" />
              <h3 className="confirm-modal-title">{confirmModal.title}</h3>
            </div>
            <p className="confirm-modal-message">{confirmModal.message}</p>
            <div className="confirm-modal-footer">
              <button className="confirm-btn-cancel" onClick={handleCancel}>
                {confirmModal.cancelText || 'Cancel'}
              </button>
              <button className="confirm-btn-confirm" onClick={handleConfirm}>
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .confirm-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; animation: confirm-fade 0.2s ease;
        }
        .confirm-modal-card {
          background: rgba(26, 26, 30, 0.95); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px; padding: 2rem; width: 90%; max-width: 440px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          animation: confirm-slide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .confirm-modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .confirm-modal-icon { font-size: 1.5rem; color: var(--primary); }
        .confirm-modal-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: #fff; }
        .confirm-modal-message { font-size: 1rem; color: var(--text-2); line-height: 1.6; margin-bottom: 2rem; }
        .confirm-modal-footer { display: flex; gap: 1rem; justify-content: flex-end; }
        
        .confirm-btn-cancel, .confirm-btn-confirm {
          padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; font-size: 0.95rem;
        }
        .confirm-btn-cancel {
          background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-2);
        }
        .confirm-btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: #fff; border-color: rgba(255, 255, 255, 0.3); }
        
        .confirm-btn-confirm {
          background: var(--primary); border: none; color: #fff;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }
        .confirm-btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4); filter: brightness(1.1); }
        .confirm-btn-confirm:active { transform: translateY(0); }

        @keyframes confirm-fade {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes confirm-slide {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
