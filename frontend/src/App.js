import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import Portfolio from './pages/Portfolio';
import Referrals from './pages/Referrals';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail';
import ResumePage from './pages/ResumePage';
import FreelancePage from './pages/FreelancePage';

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function ProtectedUser({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/?redirect=/referrals" />;
  return children;
}

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0500', color: '#d4a853', fontSize: 20, fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>
    Loading Vemunoori Collections...
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Entry point — branded login/landing */}
          <Route path="/" element={<Login />} />
          {/* Main home dashboard */}
          <Route path="/home" element={<HomePage />} />
          {/* Shop */}
          <Route path="/shop" element={<ShopPage />} />
          {/* Portfolio section */}
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/freelance" element={<FreelancePage />} />
          {/* Referrals — login required */}
          <Route path="/referrals" element={<ProtectedUser><Referrals /></ProtectedUser>} />
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          {/* Admin */}
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
