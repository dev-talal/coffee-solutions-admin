import ReportGrid from '@/components/dashboard/popularGrid/ReportGrid';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t('common.reports')}</h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ReportGrid />
        </div>
      </div>
    </div>
  );
};

export default Reports;
