import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { user, role, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) navigate('/admin/dashboard', { replace: true });
  }, [user, role, loading, navigate]);

  const handleLogin = async () => {
    try { await signInWithGoogle(); }
    catch (e) { console.error('Login failed', e); }
  };

  if (loading) {
    return (
      <div className="auth-screen">
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="auth-card">
        <div className="auth-logo">S</div>
        <h1>ShanuFx Admin</h1>
        <p>Portfolio Content Management System</p>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', color: '#2a2a3a', marginBottom: '1.75rem' }}>v2.0 — Firebase Powered</p>

        <button className="google-btn" onClick={handleLogin}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p style={{ fontSize: '0.7rem', color: '#2a2a3a', marginTop: '1.5rem', marginBottom: '1rem' }}>
          <i className="fas fa-shield-alt" style={{ marginRight: '0.3rem' }} />
          Secured with Firebase Authentication
        </p>

        <Link 
          to="/" 
          style={{ 
            fontSize: '0.8rem', 
            color: '#7c3aed', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginTop: '0.5rem',
            fontWeight: 600,
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.8}
        >
          <i className="fas fa-arrow-left" /> Back to Website
        </Link>
      </div>
    </div>
  );
}
