import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Separator } from '@/components/ui/separator';
import type { CustomerCartItem as CustomerCartItemType } from '@/common/types/customerItemsTypes';
import { PackageX } from 'lucide-react';
import { useCustomerCartQuery } from '@/features/api/customer/CustomerCartApi';
import { useMemo } from 'react';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

const CustomerCartItem = ({ item }: { item: CustomerCartItemType }) => {
  const { t } = useTranslation();

  const piecesPerBox = Number(item.product.pieces_per_box || '1');
  const quantity = Number(item.quantity);
  const isBox = item.is_box === '1';
  const effectivePrice = isBox ? item.product.final_price * piecesPerBox : item.product.final_price;

  const totalPrice = effectivePrice * quantity;

  return (
    <Card className="p-4 flex flex-row items-center justify-between gap-4 w-full">
      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={item.product.images[0]?.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <span className="font-bold text-base text-foreground">{item.product.name}</span>
        <span className="text-sm text-foreground">
          {t('common.quantity')}: {item.quantity}
        </span>
        {isBox && (
          <span className="text-sm text-foreground">
            {t('common.pieces_per_box')}: {item.product.pieces_per_box}
          </span>
        )}
      </div>

      <div className="flex flex-col items-end">
        <div className="text-right text-base font-semibold text-foreground">
          {totalPrice.toFixed(2)} {t('common.sar')}
        </div>
      </div>
    </Card>
  );
};

const CustomerCart = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: cart, isLoading } = useCustomerCartQuery(id as string, {
    refetchOnMountOrArgChange: true,
  });

  const isCartEmpty = !cart?.data || cart.data.length === 0;

  const subtotal = useMemo(() => {
    return (
      cart?.data.reduce((acc, item) => {
        const piecesPerBox = Number(item.product.pieces_per_box || '1');
        const isBox = item.is_box === '1';
        const quantity = Number(item.quantity);
        const unitPrice = isBox
          ? Number(item.product.final_price) * piecesPerBox
          : Number(item.product.final_price);

        return acc + unitPrice * quantity;
      }, 0) || 0
    );
  }, [cart?.data]);

  const calculatedTaxes = useMemo(() => {
    if (!cart?.data) return [];

    const uniqueTaxes = new Map();

    cart.data.forEach((item) => {
      const itemSubtotal =
        Number(item.quantity) *
        (item.is_box === '1'
          ? Number(item.product.final_price) * Number(item.product.pieces_per_box || '1')
          : Number(item.product.final_price));

      item.product.taxes?.forEach((tax) => {
        const taxId = tax.name; // Changed from ID to name for uniqueness
        const currentAmount = uniqueTaxes.get(taxId)?.amount || 0;
        const taxRate = Number(tax.rate);
        const newAmount = currentAmount + (itemSubtotal * taxRate) / 100;

        uniqueTaxes.set(taxId, {
          id: taxId,
          name: tax.name,
          rate: taxRate,
          amount: newAmount,
        });
      });
    });

    return Array.from(uniqueTaxes.values());
  }, [cart?.data]);

  const taxSum = useMemo(() => {
    return calculatedTaxes.reduce((acc, tax) => acc + tax.amount, 0);
  }, [calculatedTaxes]);

  const total = useMemo(() => subtotal + taxSum, [subtotal, taxSum]);

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <>
      <BackButtonNavigation />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Card className="p-8">
              <div className="flex justify-start items-center gap-2 mb-6">
                <DynamicIcon
                  name="shopping-cart"
                  strokeWidth={2.5}
                  className="w-6 h-6 text-foreground"
                />
                <h1 className="text-3xl font-bold">{t('common.customerCart')}</h1>
              </div>

              <CardContent className="p-4 space-y-10">
                {isCartEmpty ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                    <PackageX className="w-12 h-12 mb-4 text-destructive" />
                    <p className="text-lg font-medium">{t('common.emptyCart')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <div className="flex flex-row gap-2 justify-start items-start mb-4">
                          <DynamicIcon name="box" className="w-6 h-6 text-foreground" />
                          <span className="text-sm font-bold text-foreground">
                            {t('common.cartItems')} ({cart.data.length})
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 w-full">
                          {cart.data.map((item) => (
                            <CustomerCartItem key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-end flex-col space-y-4">
                      <div className="text-sm text-muted-foreground space-x-2">
                        <span>{t('common.subtotalExclTax')}</span>
                        <span className="font-bold">
                          {(subtotal - taxSum).toFixed(2)} {t('common.sar')}
                        </span>
                      </div>
                      <Separator />

                      {calculatedTaxes.length > 0 && (
                        <div className="text-sm text-muted-foreground space-y-1 w-full">
                          <span className="font-semibold">{t('common.taxes')}</span>
                          {calculatedTaxes.map((tax) => (
                            <div key={tax.id} className="flex justify-between text-sm">
                              <span>
                                {tax.name} ({tax.rate}%)
                              </span>
                              <span className="font-semibold">
                                +{tax.amount.toFixed(2)} {t('common.sar')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Separator />

                      <div className="text-base text-foreground space-x-2 font-bold">
                        <span>{t('common.total_inc_tax')}</span>
                        <span>
                          {(total - taxSum).toFixed(2)} {t('common.sar')}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerCart;
