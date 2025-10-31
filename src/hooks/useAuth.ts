import { useAppSelector } from '@/store';

export const useAuth = () => {
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
  return { isAuthenticated, loading, user };
};
