'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';

declare global {
  interface Window {
    canRunAds?: boolean;
  }
}

export default function AdBlockDetector({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (user) return;

    const checkAdBlock = async () => {
      if (user) return;

      window.canRunAds = false;
      const scriptTest = new Promise<boolean>((resolve) => {
        const script = document.createElement('script');
        script.src = '/ads.js';
        script.async = true;

        script.onload = () => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          resolve(window.canRunAds !== true);
        };
        script.onerror = () => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          resolve(true);
        };
        setTimeout(() => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          resolve(window.canRunAds !== true);
        }, 1500);
        document.head.appendChild(script);
      });

      const blocked = await scriptTest;
      setIsBlocked(blocked);
    };

    checkAdBlock();
  }, [user]);

  if (isBlocked && !user) {
    return (
      <>
        {children}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="adblock-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="adblock-card"
          >
            <div className="adblock-emoji">🛡️</div>
            <h2 className="adblock-title">
              Shields Detected
            </h2>
            <p className="adblock-desc">
              I noticed you&apos;re using an ad-blocker or Brave Shields. To view the full experience, please consider disabling them for this site.
              <br /><br />
              <strong className="adblock-brave">Brave Users:</strong> Click the orange lion icon in your address bar and toggle Shields to <strong>OFF</strong>.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary btn-full"
            >
              I&apos;ve disabled it, reload
            </button>
            <p className="adblock-footnote">
              No ads here! Shields just break some of my custom networking optimizations.
            </p>
          </motion.div>
        </motion.div>
      </>
    );
  }

  return <>{children}</>;
}
