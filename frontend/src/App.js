import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import Referrals from './pages/Referrals';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{color:'#00d4ff',textAlign:'center',padding:'100px',fontSize:'18px'}}>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return children;
}

function ProtectedUser({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{color:'#00d4ff',textAlign:'center',padding:'100px',fontSize:'18px'}}>Loading...</div>;
  if (!user) return <Navigate to="/login?redirect=/referrals" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/referrals" element={<ProtectedUser><Referrals /></ProtectedUser>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
