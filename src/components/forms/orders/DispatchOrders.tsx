import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWarehousesQuery } from '@/features/api/orders/ordersApi';
import { useDispatchOrderMutation } from '@/features/api/orders/ordersApi';
import { useGetDriversByOrderQuery } from '@/features/api/drivers/driversApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormSelect } from '../context/FormSelect';
import { useTranslation } from 'react-i18next';
import { dispatchOrderSchema, type DispatchOrderValues } from '@/utils/validations/orders';
import type { Order } from '@/common/types/orderTypes';

interface DispatchOrdersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSuccess?: () => void;
}

export default function DispatchOrders({
  open,
  onOpenChange,
  order,
  onSuccess,
}: DispatchOrdersProps) {
  const { data: warehouses } = useWarehousesQuery(undefined, {
    skip: !open,
  });

  const { data: drivers } = useGetDriversByOrderQuery(order?.id ?? 0, {
    skip: !open || !order,
  });

  const { t } = useTranslation();
  const form = useForm<DispatchOrderValues>({
    resolver: zodResolver(dispatchOrderSchema(t)),
    defaultValues: { driver_id: '' },
  });
  const [dispatchOrder, { isLoading }] = useDispatchOrderMutation();

  useEffect(() => {
    if (open) {
      form.reset({ driver_id: order?.driver_id || '' });
    }
  }, [open, form, order]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!data.driver_id || !order) return;

    await dispatchOrder({
      order_id: order.id,
      driver_id: Number(data.driver_id),
    });
    onSuccess?.();
    onOpenChange(false);
  });

  const currentWarehouse = warehouses?.find((w) => w.id === order?.warehouse.id);

  const driverOptions =
    drivers?.map((driver) => ({
      label: `${driver.first_name} ${driver.last_name}`,
      value: driver.id.toString(),
    })) || [];

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('common.dispatch_order')}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {order && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 dark:text-black">
                <div className="text-sm font-semibold mb-2">{t('common.order_details')}</div>
                <div>
                  <span className="font-bold">{t('common.order_id')}: </span>
                  {order.id}
                </div>
                <div>
                  <span className="font-bold">{t('common.customer')}: </span>
                  {order.user
                    ? `${order.user.first_name} ${order.user.last_name}`
                    : t('common.undefined_user')}
                </div>
                <div>
                  <span className="font-bold">{t('common.status')}: </span>
                  {order.status}
                </div>
                <div>
                  <span className="font-bold">{t('common.payment_method')}: </span>
                  {order.payment_method}
                </div>
                <div>
                  <span className="font-bold">{t('common.total')}: </span>
                  {order.total_amount}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentWarehouse">{t('common.warehouse')}</Label>
              <Input
                id="currentWarehouse"
                value={currentWarehouse?.name || 'Not assigned'}
                disabled
                className="rounded-full hover:border-red-200"
              />
            </div>

            <FormSelect
              name="driver_id"
              label={t('common.assign_driver')}
              placeholder={t('common.select_driver')}
              options={driverOptions}
              className="rounded-full w-full"
            />
          </div>

          <DialogFooter className="flex justify-center ">
            <Button
              onClick={handleSubmit}
              className="w-full rounded-full bg-amber-400 hover:bg-amber-500 text-white disabled:opacity-50"
            >
              {isLoading ? t('common.dispatching') : t('common.dispatch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
