import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import MainPage from './pages/user/MainPage';
import HallPage from './pages/user/HallPage';
import PaymentPage from './pages/user/PaymentPage';
import TicketPage from './pages/user/TicketPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const isClientSide = !location.pathname.startsWith('/admin');
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="px-4 sm:px-6 lg:px-8">
      <div className="layout-990 header-bar flex justify-between items-center">
        <Link to={isAdmin && !isClientSide ? '/admin' : '/'} className="text-decoration-none">
          <h1 className="heading-1 flex flex-col leading-none">
            <span>
              ИДЕМ<span className="heading-1-thin">В</span>КИНО
            </span>
            {isAdminPage && (
              <span className="heading-1-subtitle">Администраторская</span>
            )}
          </h1>
        </Link>

        {!isAdmin && isClientSide && location.pathname === '/' && (
          <Link to="/admin/login" className="btn-login-figma hover:opacity-90 transition-opacity">
            Войти
          </Link>
        )}

        {isAdmin && (
          <div className="header-actions">
            {!isClientSide && (
              <Link to="/" className="text-white hover:text-teal-300 transition-colors">
                Клиентская часть
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <AdminLoginPage />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Apply your design: gradient overlay directly in backgroundImage for admin pages,
  // and remove the extra full-screen black overlay.
  const adminBg = "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/admin-bg.jpg')";
  const clientBg = "url('/images/cinema-bg.jpg')";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: isAdminPage ? adminBg : clientBg }}
    >
      <div className="min-h-screen">
        <Header />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/hall/:seanceId" element={<HallPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket" element={<TicketPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DataProvider>
      <HashRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
