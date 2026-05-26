import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import GitHubCallback from './pages/GitHubCallback';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import Portfolio from './pages/Portfolio';
import Referrals from './pages/Referrals';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail';
import ResumePage from './pages/ResumePage';
import FreelancePage from './pages/FreelancePage';
import JobsPage from './pages/JobsPage';
import HirePage from './pages/HirePage';

function Protected({ children, redirectTo }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to={`/?redirect=${redirectTo || '/home'}`} />;
  return children;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/?redirect=/admin" />;
  if (user.role !== 'admin') return <Navigate to="/home" />;
  return children;
}

const Loader = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0500', color:'#d4a853', fontSize:20, fontFamily:'Syne,sans-serif', fontWeight:700 }}>
    Loading...
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopBar />
        <Routes>
          {/* ── PUBLIC ── */}
          <Route path="/"              element={<Login />} />
          <Route path="/auth/github"   element={<GitHubCallback />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/portfolio"     element={<Portfolio />} />
          <Route path="/projects/:id"  element={<ProjectDetail />} />
          <Route path="/resume"        element={<ResumePage />} />
          {/* Freelance pages — public so clients can hire and freelancers can register */}
          <Route path="/freelance"     element={<FreelancePage />} />
          <Route path="/freelance/jobs" element={<JobsPage />} />
          <Route path="/freelance/hire" element={<HirePage />} />

          {/* ── PROTECTED — login required ── */}
          <Route path="/home"          element={<Protected redirectTo="/home"><HomePage /></Protected>} />
          <Route path="/shop"          element={<Protected redirectTo="/shop"><ShopPage /></Protected>} />
          <Route path="/referrals"     element={<Protected redirectTo="/referrals"><Referrals /></Protected>} />

          {/* ── ADMIN ONLY ── */}
          <Route path="/admin"         element={<AdminOnly><AdminDashboard /></AdminOnly>} />

          <Route path="*"              element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
