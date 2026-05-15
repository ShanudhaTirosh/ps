import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home       from './pages/Home';
import Showcase   from './pages/Showcase';
import TestimonialsPage from './pages/TestimonialsPage';
import NotFound   from './pages/NotFound';
import AdminLogin from './admin/Login';
import Dashboard  from './admin/Dashboard';
import AdminGuard from './admin/AdminGuard';

function RightClickProtector({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (!user) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [user]);

  return children;
}

function AdBlockDetector({ children }) {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (user) return; // Don't check for admins

    const checkAdBlock = async () => {
      if (user) return;

      // Adblockers and Brave Shields are hardcoded to block scripts named ads.js
      window.canRunAds = false; 
      const scriptTest = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = '/ads.js'; // This was created earlier in the public folder
        script.async = true;
        
        script.onload = () => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          // If script loaded, check if it actually executed (window.canRunAds set in ads.js)
          resolve(window.canRunAds !== true);
        };
        script.onerror = () => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          resolve(true); // Explicitly blocked by a shield/blocker
        };
        // Timeout check
        setTimeout(() => {
          try { document.head.removeChild(script); } catch { /* ignore */ }
          resolve(window.canRunAds !== true);
        }, 1500);
        document.head.appendChild(script);
      });

      const isBlocked = await scriptTest;
      setIsBlocked(isBlocked);
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
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(5, 5, 10, 0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            style={{
              maxWidth: 450, width: '100%',
              background: 'rgba(124, 58, 237, 0.1)',
              borderRadius: 32, padding: '3rem 2rem',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛡️</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f1f0f7', fontWeight: 800 }}>Shields Detected</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              I noticed you're using an ad-blocker or Brave Shields. To view the full experience, please consider disabling them for this site.
              <br /><br />
              <strong style={{ color: '#ff4d00' }}>Brave Users:</strong> Click the orange lion icon in your address bar and toggle Shields to <strong>OFF</strong>.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              I've disabled it, reload
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
              No ads here! Shields just break some of my custom networking optimizations.
            </p>
          </motion.div>
        </motion.div>
      </>
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdBlockDetector>
          <RightClickProtector>
            <Routes>
              <Route path="/"                element={<Home />} />
              <Route path="/showcase"        element={<Showcase />} />
              <Route path="/testimonials"    element={<TestimonialsPage />} />
              <Route path="/admin"           element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminGuard><Dashboard /></AdminGuard>} />
              <Route path="*"                element={<NotFound />} />
            </Routes>
          </RightClickProtector>
        </AdBlockDetector>
      </AuthProvider>
    </BrowserRouter>
  );
}
