import AddPromotion from '@/components/forms/promotions/AddPromotion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

export default function ProductPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <>
      <BackButtonNavigation />
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">
          {t(id ? 'common.edit_promotion' : 'common.add_new_promotion')}
        </h2>
        <div className="bg-transparent">
          <AddPromotion />
        </div>
      </div>
    </>
  );
}
