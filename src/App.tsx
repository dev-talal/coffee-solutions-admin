import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardRoutes from '@/routes/DashboardRoutes';
import PublicLayout from './components/layouts/PublicLayout';
import ForgetPasswordPage from './pages/auth/ForgetPassword';
import { useSocketHook } from './hooks/socket-hook';

function App() {
  useEffect(() => {
    import('@/App.css');
  }, []);

  useSocketHook();

  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      </Route>
      <Route path="/*" element={<DashboardLayout />}>
        <Route path="*" element={<DashboardRoutes />} />
      </Route>
    </Routes>
  );
}

export default App;
