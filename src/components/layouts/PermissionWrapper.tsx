import { useAuth } from '@/hooks/useAuth';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const PermissionWrapper = ({
  children,
  permission,
}: {
  children: ReactElement;
  permission: string;
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  return user.permissions.includes(permission) ? (
    children
  ) : (
    <div className="text-center py-7 h-full flex flex-col justify-center items-center">
      <DynamicIcon name="shield-x" className="w-24 h-24 mx-auto text-red-500" />
      <h3 className="mt-6 text-lg font-semibold">{t('not_permission')}</h3>
    </div>
  );
};

export default PermissionWrapper;
