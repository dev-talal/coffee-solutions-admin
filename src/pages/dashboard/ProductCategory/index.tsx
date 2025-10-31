import ProductCategoryGrid from '@/components/dashboard/popularGrid/ProductCategoryGrid';
import { useTranslation } from 'react-i18next';

const CustomerCategory = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('sidebar.productsCategory')}</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ProductCategoryGrid />
        </div>
      </div>
    </div>
  );
};

export default CustomerCategory;
