import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Approvals from './pages/Approvals';
import Rooms from './pages/Rooms';
import Academic from './pages/Academic';
import AdminControl from './pages/AdminControl';
import Communication from './pages/Communication';
import Timetable from './pages/Timetable';
import useAuthStore from './store/authStore.js';
import { useEffect, useState } from 'react';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setIsChecking(false));
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#EAEFF7' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #232051', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/academic" element={<ProtectedRoute><Academic /></ProtectedRoute>} />
        <Route path="/admin-control" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminControl />
          </ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
        {/* Redirect root and unknown routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
