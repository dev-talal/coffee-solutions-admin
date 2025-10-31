import { useParams } from 'react-router';
import { useOrderDetailsQuery } from '@/features/api/orders/ordersApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStatusColortext, getStatusColorDual } from '@/helpers/colorStatus';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { OrderItem } from '@/common/types/orderTypes';
import { DynamicIcon } from 'lucide-react/dynamic';
import BackButtonNavigation from '@/components/common/BackButtonNavigation';

export default function OrderDetailsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { id } = useParams();
  const { data: order, isLoading } = useOrderDetailsQuery(id as string);

  if (isLoading || !order) {
    return <DynamicIcon name="loader" className="animate-spin w-6 h-6" />;
  }

  const user = order.user;

  return (
    <>
      <BackButtonNavigation />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">{t('common.order_details')}</h1>

        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4">
          <div className="space-y-4 lg:w-[70%] ">
            {/* Order Info */}
            <Card className="w-full">
              <CardHeader className="font-semibold text-xl">{t('common.order_info')}</CardHeader>
              <CardContent className="text-sm px-4">
                <div className="w-full divide-y">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-muted-foreground">{t('common.order_id')}:</p>
                    <p className="font-medium text-right">#ORD-{order.id}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-muted-foreground">{t('common.status')}:</p>
                    <div className="text-right flex items-center gap-2">
                      <DynamicIcon
                        name="circle"
                        size={12}
                        className={`${
                          order.status === 'pending'
                            ? 'text-amber-400'
                            : order.status === 'delivered'
                              ? 'text-green-400'
                              : 'text-red-400'
                        }`}
                        fill="currentColor"
                      />
                      {t(`common.status_${order.status}`)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-muted-foreground">{t('common.order_date')}:</p>
                    <p className="text-right">{order.created_at.toString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="font-semibold text-xl">{t('common.order_items')}</span>
                  <div className={`flex items-center justify-start gap-2 `}>
                    <div
                      className={`mr-1 rounded-full h-8 w-8 flex items-center justify-center ${getStatusColorDual(order.status)}`}
                    >
                      {order.status === 'cancelled' && (
                        <DynamicIcon name="ban" className="h-5 w-5" />
                      )}
                      {order.status === 'pending' && (
                        <DynamicIcon name="package-open" className="h-5 w-5" />
                      )}
                      {order.status === 'shipping' && (
                        <DynamicIcon name="truck" className="h-5 w-5" />
                      )}
                      {order.status === 'delivered' && (
                        <DynamicIcon name="circle-check" className="h-5 w-5" />
                      )}
                    </div>

                    <span className={`font-semibold text-lg ${getStatusColortext(order.status)}`}>
                      {t(`common.status_${order.status}`)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-md p-3 bg-accent"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product_image || '/placeholder.jpg'}
                        alt="Product"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-bold">
                          {isRtl ? item.ar_product_name : item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.is_box === '0'
                            ? isRtl
                              ? item.ar_unit
                              : item.unit
                            : isRtl
                              ? item.ar_uom_unit
                              : item.uom_unit}

                          {item.is_box === '1' &&
                            `(${item.product_pieces_per_box} ${isRtl ? item.ar_unit : item.unit})`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {t('common.sar')}
                        {parseFloat(item.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('common.quantity')}: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="w-full">
              <CardHeader className="flex items-center">
                <div className="flex items-center gap-2 border-b pb-4 w-full">
                  <DynamicIcon
                    name="circle-dollar-sign"
                    size={16}
                    className={`mr-1 rounded-full h-8 w-8 ${getStatusColorDual(order.status)}`}
                  />
                  <span className={`font-semibold text-lg ${getStatusColortext(order.status)}`}>
                    {t(`common.status_${order.status}`)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">{t('common.subtotal')}</span>
                  <span>
                    {t('common.sar')}
                    {parseFloat(String(order.sub_total)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">{t('common.total_tax')}</span>
                  <span>
                    {t('common.sar')}
                    {parseFloat(String(order.tax_amount)).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>{t('common.total')}</span>
                  <span>
                    {t('common.sar')}
                    {parseFloat(String(order.total_amount)).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info */}
          <div className="space-y-4 lg:w-[30%]">
            <Card className="w-full">
              <CardHeader className="font-semibold text-2xl">{t('common.customerInfo')}</CardHeader>
              <CardContent className="text-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-14">
                      <AvatarImage
                        src={user?.profile || '/placeholder.jpg'}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user ? `${user?.first_name[0]} ${user?.last_name[0]}` : 'UD'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="items-start">
                      <p className="font-bold text-lg">
                        {user
                          ? `${user?.first_name} ${user?.last_name}`
                          : t('common.undefined_user')}
                      </p>
                      <p className="text-md text-muted-foreground">{user ? user?.email : 'N/A'}</p>
                    </div>
                  </div>
                  <DynamicIcon name="mail" className="h-5 w-5 mr-1 text-amber-400" />
                </div>
                <div className="text-start flex flex-col items-start w-fit">
                  {order.is_linked == 1 ? (
                    <div>
                      <h4 className="font-bold text-lg">{t('common.locationLink')}</h4>
                      <p className="text-sm break-all underline">
                        <a href={order.address_link} target="_blank">
                          {order.address_link}
                        </a>
                      </p>
                    </div>
                  ) : order.is_linked == 0 ? (
                    <>
                      <h3 className="font-bold text-lg">{t('common.deliveryAddress')}</h3>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.shortAddress')} :</p>
                        <p className="text-xs">
                          {isRtl ? order.ar_short_address : order.short_address}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.buildingNumber')} :</p>
                        <p className="text-xs">
                          {isRtl ? order.ar_building_number : order.building_number}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.secondaryNumber')} :</p>
                        <p className="text-xs">
                          {isRtl ? order.ar_secondary_number : order.secondary_number}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.country')} :</p>
                        <p className="text-xs">{isRtl ? order.ar_country : order.ar_country}</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.city')} :</p>
                        <p className="text-xs">{isRtl ? order.ar_city : order.city}</p>
                      </div>

                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t('common.postalCode')} :</p>
                        <p className="text-xs">
                          {isRtl ? order.ar_postal_code : order.postal_code}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-lg">{t('common.contactInformation')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DynamicIcon name="phone" className="h-5 w-5 mr-1 text-amber-400" />
                    <span>{user ? user?.phone : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DynamicIcon name="mail" className="h-5 w-5 mr-1 text-amber-400" />
                    <span>{user ? user?.email : 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
