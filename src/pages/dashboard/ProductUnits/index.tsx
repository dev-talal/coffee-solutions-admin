import ProductUnitsGrid from '@/components/dashboard/popularGrid/ProductUnitsGrid';
import { useTranslation } from 'react-i18next';

const ProductUnits = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t('sidebar.product_units')}</h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ProductUnitsGrid />
        </div>
      </div>
    </div>
  );
};

export default ProductUnits;
