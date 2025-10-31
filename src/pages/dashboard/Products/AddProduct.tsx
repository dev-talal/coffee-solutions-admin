import AddProductForm from '@/components/forms/product/AddProduct';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

export default function PromotionPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <>
      <BackButtonNavigation />
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">
          {t(id ? 'common.edit_product' : 'common.add_new_product')}
        </h2>
        <div className="bg-transparent">
          <AddProductForm />
        </div>
      </div>
    </>
  );
}
