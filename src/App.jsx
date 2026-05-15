import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}
