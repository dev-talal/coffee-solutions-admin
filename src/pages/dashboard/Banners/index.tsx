import BannerGrid from '@/components/dashboard/popularGrid/BannerGrid';
import { useTranslation } from 'react-i18next';

export default function Banners() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('common.banners')}</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <BannerGrid />
        </div>
      </div>
    </div>
  );
}
