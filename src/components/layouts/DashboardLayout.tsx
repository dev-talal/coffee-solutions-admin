import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/partials/DashboardSidebar';
import DashboardHeader from '@/components/partials/DashboardHeader';
import { useAppDispatch } from '@/store';
import { useCheckAuthQuery } from '@/features/api/auth/authApi';
import { setUserValues } from '@/features/slices/auth/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { images } from '@/assets';
import SuccessDialog from '../common/successDialogue';
import { Loader } from 'lucide-react';

const DashboardLayout = () => {
  const { data, isFetching } = useCheckAuthQuery(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUserValues(data.data));
    }
  }, [data, dispatch]);

  if (isFetching)
    return (
      <div className="h-lvh bg-sidebar w-full flex justify-center items-center">
        <div className="text-center space-y-10">
          <img src={images.mainLogo1} width="220px" />
          <Loader className="w-12 h-12 mx-auto animate-spin text-white" />
        </div>
      </div>
    );

  return isAuthenticated ? (
    <div>
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="h-full">
            <div className="container mx-auto px-4 py-8 h-full">
              <Outlet />
              <SuccessDialog />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  ) : (
    <Navigate to="/" replace />
  );
};

export default DashboardLayout;
