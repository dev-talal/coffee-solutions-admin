import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoleDetail } from '@/components/dashboard/popularGrid/columnData/roleDetailsData';
import RoleDetailsGrid from '@/components/dashboard/popularGrid/RoleDetailsGrid';
import { useTranslation } from 'react-i18next';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

const role: RoleDetail = {
  id: '1',
  name: 'Admin',
  description: 'Full access to all system features',
  permissions: ['manage_users', 'view_reports', 'edit_settings'],
};

function RoleDetailsPage() {
  const { t } = useTranslation();

  return (
    <>
      <BackButtonNavigation />
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">{t('common.role')}:</span>
                    <span className="text-lg font-bold">{role.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl font-semibold">{t('common.permissions')}:</span>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="bg-gray-200 dark:bg-black px-2 py-1 text-sm rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <RoleDetailsGrid />
          </div>
        </div>
      </div>
    </>
  );
}

export default RoleDetailsPage;
