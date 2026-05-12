import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="bg-noise" /><div className="grid-bg" />
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', zIndex: 1, position: 'relative' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '8rem', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontFamily: 'JetBrains Mono,monospace' }}>// Page not found in the filesystem</p>
        <Link to="/" className="btn-primary">
          <i className="fas fa-home" /> Go Home
        </Link>
      </div>
    </div>
  );
}
