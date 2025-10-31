import ProductGrid from '@/components/dashboard/popularGrid/ProductGrid';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t('common.products')}</h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default Products;
