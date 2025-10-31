import { lazy, useEffect, useMemo, useState, Suspense } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { getStatusColorDual } from '@/helpers/colorStatus';
import { useProductDetailsQuery } from '@/features/api/products/productApi';
import { DynamicIcon } from 'lucide-react/dynamic';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

const Lightbox = lazy(() => import('yet-another-react-lightbox'));

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [isOpen, setIsOpen] = useState(false);
  const { data: product, isFetching } = useProductDetailsQuery(id as string);
  const [startIndex, setStartIndex] = useState(0);

  const openLightbox = (index: number = 0) => {
    setStartIndex(index);
    setIsOpen(true);
  };

  const slides = useMemo(() => {
    if (product) return product.images.map((item) => ({ src: item.image }));
    else return [];
  }, [product]);

  useEffect(() => {
    import('yet-another-react-lightbox/styles.css');
  }, []);

  return (
    <>
      <BackButtonNavigation />
      <div className="p-6 flex flex-col xl:justify-center xl:items-center space-y-6">
        <div className="flex flex-col items-start w-full max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold">{t('common.product_details')}</h1>

          <div className="flex flex-col lg:flex-row lg:space-x-4 w-full">
            <div className="space-y-4 w-full">
              <Card>
                <CardHeader className="font-semibold text-xl flex justify-start">
                  <span>{t('common.basic_info')}</span>
                </CardHeader>
                <CardContent className="text-sm px-8 space-y-3">
                  {!isFetching && product && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-foreground text-sm mb-1 font-bold">
                            {t('common.product_name')}
                          </p>
                          <p className="font-medium text-muted-foreground">
                            {isRtl ? product.ar_name : product.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-foreground text-sm mb-1 font-bold">
                            {t('common.quantity')}
                          </p>
                          <p className="font-medium text-muted-foreground">{product.quantity}</p>
                        </div>

                        {product.category && (
                          <div>
                            <p className="text-foreground text-sm mb-1 font-bold">
                              {t('common.category')}
                            </p>
                            <p className="font-medium text-muted-foreground">
                              {product.category.name}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-foreground text-sm mb-1 font-bold">
                            {t('common.price')}
                          </p>
                          <p className="font-medium text-muted-foreground">
                            {t('common.sar')}
                            {Number(product.price).toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-foreground text-sm mb-1 font-bold">
                            {t('common.status')}
                          </p>
                          <div
                            className={`font-medium py-0.5 px-2 rounded-full w-fit ${getStatusColorDual(
                              product.status,
                            )}`}
                          >
                            {product.status === '1' ? t('common.active') : t('common.inactive')}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="pt-4">
                        <span className="font-semibold block mb-1">
                          {t('common.product_description')}:
                        </span>
                        <p className="text-muted-foreground">
                          {isRtl ? product.ar_description : product.description}
                        </p>
                      </div>
                    </>
                  )}

                  {isFetching && <DynamicIcon name="loader" size={26} className="animate-spin" />}

                  {!isFetching && !product && (
                    <div className="text-2xl text-red-500">{t('common.no_results')}</div>
                  )}
                </CardContent>
              </Card>

              {!isFetching && product && (
                <Card>
                  <CardHeader className="font-semibold text-xl">
                    {t('common.product_images')}
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                    {product.images.map((list, i) => (
                      <div
                        key={i}
                        className="relative rounded-md border p-1 bg-card dark:bg-muted shadow cursor-pointer"
                        onClick={() => openLightbox(i)}
                      >
                        <img
                          src={list.image}
                          alt={`product-${i + 1}`}
                          className="w-[220px] h-[220px] object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        <Lightbox open={isOpen} close={() => setIsOpen(false)} slides={slides} index={startIndex} />
      </Suspense>
    </>
  );
}
