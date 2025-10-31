import CustomerGrid from '@/components/dashboard/popularGrid/CustomerGrid';
import { useTranslation } from 'react-i18next';

const Customer = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t('common.customerList')}</h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <CustomerGrid />
        </div>
      </div>
    </div>
  );
};

export default Customer;
