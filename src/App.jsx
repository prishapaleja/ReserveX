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
import { useEffect } from 'react';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if ((!user) || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
  return children;
}
function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/admin-control" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminControl />
          </ProtectedRoute>} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/timetable" element={<Timetable />} />
        {/* Redirect unknown routes to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
