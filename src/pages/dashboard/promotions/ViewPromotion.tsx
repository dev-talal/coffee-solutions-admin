import { useParams } from 'react-router';
import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStatusColorDual } from '@/helpers/colorStatus';
import { usePromotionDetailsQuery } from '@/features/api/promotions/promotionsApi';
import { useNavigate } from 'react-router';
import type { Product } from '@/common/types/productTypes';
import type { Promotion } from '@/common/types/promotionTypes';
import { DynamicIcon } from 'lucide-react/dynamic';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

const Lightbox = lazy(() => import('yet-another-react-lightbox'));

function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <img
        src={product.images?.[0]?.image || '/placeholder.png'}
        alt={product.name}
        className="w-full h-[220px] object-contain rounded-t-xl mt-[-20px]"
      />
      <CardContent>
        <div className="flex flex-row justify-between mb-3">
          <div className="w-[70%]">
            <p className="font-bold text-lg line-clamp-1">
              {isRTL ? product.ar_name : product.name}
            </p>
          </div>
          <div>
            <p className="font-bold text-lg">
              <span>{t('common.sar')}</span> {product.final_price}
            </p>
          </div>
        </div>
        <p className="text-sm">
          <span className="font-semibold">{t('common.quantity')}</span>: {product.quantity}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {isRTL ? product.ar_description : product.description}
        </p>
      </CardContent>
    </Card>
  );
}

function ProductGridWithDelay({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const [isLoadingDone, setIsLoadingDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingDone(true);
    }, 800);
    return () => clearTimeout(timeout);
  }, [products]);

  const gridStyle =
    products.length === 1
      ? { gridTemplateColumns: 'minmax(150px, 250px)' }
      : { gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };

  return (
    <div
      className={`grid gap-4 ${
        products.length === 1 ? 'justify-items-start sm:justify-items-center' : ''
      }`}
      style={gridStyle}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {isLoadingDone && products.length === 0 && (
        <div className="text-red-500 text-xl col-span-full">{t('common.no_results')}</div>
      )}
    </div>
  );
}

export default function ViewPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const { data: promotion, isFetching: isPromotionLoading } = usePromotionDetailsQuery(id!) as {
    data?: Promotion;
    isFetching: boolean;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openLightbox = (index: number = 0) => {
    setStartIndex(index);
    setIsOpen(true);
  };

  const slides = useMemo(() => {
    return promotion?.images?.map((item) => ({ src: item.image })) || [];
  }, [promotion]);

  useEffect(() => {
    import('yet-another-react-lightbox/styles.css');
  }, []);

  return (
    <>
      <BackButtonNavigation />
      <div className="p-6 flex flex-col xl:justify-center xl:items-center space-y-6">
        <div className="flex flex-col w-full max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold">{t('common.promotion_details')}</h1>

          <Card>
            <CardHeader className="font-semibold text-xl">{t('common.basic_info')}</CardHeader>
            <CardContent className="space-y-3 text-sm px-8">
              {isPromotionLoading && <DynamicIcon name="loader" className="animate-spin" />}
              {!isPromotionLoading && promotion && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold">{t('common.promotion_name')}</p>
                      <p className="text-muted-foreground">
                        {isRTL ? promotion.ar_name : promotion.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t('common.promotion_code')}</p>
                      <p className="text-muted-foreground">{promotion.code}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t('common.quantity')}</p>
                      <p className="text-muted-foreground">{promotion.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t('common.price')}</p>
                      <p className="text-muted-foreground">${Number(promotion.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t('common.status')}</p>
                      <div
                        className={`font-medium py-0.5 px-2 rounded-full w-fit ${getStatusColorDual(
                          promotion.status,
                        )}`}
                      >
                        {promotion.status === '1' ? t('common.active') : t('common.inactive')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t('common.expiry_date')}</p>
                      <p className="text-muted-foreground">
                        {promotion.promotion_end_date
                          ? new Date(promotion.promotion_end_date).toLocaleDateString()
                          : t('common.undefined')}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">{t('common.promotion_description')}:</p>
                    <p className="text-muted-foreground">
                      {isRTL ? promotion.ar_description : promotion.description}
                    </p>
                  </div>
                </>
              )}
              {!isPromotionLoading && !promotion && (
                <div className="text-red-500 text-xl">{t('common.no_results')}</div>
              )}
            </CardContent>
          </Card>

          {promotion && promotion?.images?.length > 0 && (
            <Card className="space-y-1">
              <CardHeader className="font-semibold text-2xl">
                {t('common.promotion_image')}
              </CardHeader>
              <CardContent className="grid mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-18 lg:mx-0 lg:justify-start">
                {promotion.images.map((img, i) => (
                  <div
                    key={img.id || i}
                    className="rounded-md border max-w-[220px] p-1 bg-card dark:bg-muted-foreground shadow"
                  >
                    <img
                      src={img.image}
                      alt={`promotion-image-${i + 1}`}
                      className="w-full h-[200px] object-cover rounded-md cursor-pointer"
                      onClick={() => openLightbox(i)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="font-semibold text-2xl">{t('common.promotion_products')}</h2>
            <ProductGridWithDelay
              products={promotion?.prmotion_products?.map((pp) => pp.product) || []}
            />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <Lightbox open={isOpen} close={() => setIsOpen(false)} slides={slides} index={startIndex} />
      </Suspense>
    </>
  );
}
