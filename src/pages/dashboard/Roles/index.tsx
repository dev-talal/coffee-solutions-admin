import RolesGrid from '@/components/dashboard/popularGrid/RolesGrid';
import { useTranslation } from 'react-i18next';

export default function RolesPage() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('common.manage_roles')}</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <RolesGrid />
        </div>
      </div>
    </div>
  );
}
