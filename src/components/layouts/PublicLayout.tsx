import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const PublicLayout = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>{t('common.loading')}</div>;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicLayout;
