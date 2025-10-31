import RegionGrid from '@/components/dashboard/popularGrid/RegionGrid';
import { useTranslation } from 'react-i18next';

const Regions = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('common.regions')}</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <RegionGrid />
        </div>
      </div>
    </div>
  );
};

export default Regions;
