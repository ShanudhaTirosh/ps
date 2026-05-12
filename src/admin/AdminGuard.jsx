import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminGuard({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-screen">
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner" />
          <p style={{ color: '#4b5563', fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem' }}>Verifying auth...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  if (!role)  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f43f5e', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#4b5563', fontSize: '0.82rem' }}>This account is not authorized. Contact the primary admin.</p>
      </div>
    </div>
  );

  return children;
}
