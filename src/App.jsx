import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home       from './pages/Home';
import Showcase   from './pages/Showcase';
import NotFound   from './pages/NotFound';
import AdminLogin from './admin/Login';
import Dashboard  from './admin/Dashboard';
import AdminGuard from './admin/AdminGuard';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/showcase"        element={<Showcase />} />
          <Route path="/admin"           element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><Dashboard /></AdminGuard>} />
          <Route path="*"                element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
