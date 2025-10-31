import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWarehousesQuery } from '@/features/api/orders/ordersApi';
import { useTransferOrderMutation } from '@/features/api/orders/ordersApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormSelect } from '../context/FormSelect';
import { useTranslation } from 'react-i18next';
import { transferOrderSchema, type TransferOrderValues } from '@/utils/validations/orders';

interface TransferOrdersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order_id: number;
  transfer_to?: number;
  onSuccess?: () => void;
}

export default function TransferOrders({
  open,
  onOpenChange,
  order_id,
  transfer_to: currentWarehouseId,
  onSuccess,
}: TransferOrdersProps) {
  const { data: warehouses } = useWarehousesQuery(undefined, {
    skip: !open,
  });

  const { t } = useTranslation();
  const form = useForm<TransferOrderValues>({
    resolver: zodResolver(transferOrderSchema(t)),
    defaultValues: { transfer_to: '' },
  });
  const [transferOrder, { isLoading }] = useTransferOrderMutation();

  useEffect(() => {
    if (open) {
      form.reset({ transfer_to: '' });
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!data.transfer_to) return;

    await transferOrder({ order_id, transfer_to: Number(data.transfer_to) });
    onSuccess?.();
    onOpenChange(false);
  });

  const currentWarehouse = warehouses?.find((w) => w.id === currentWarehouseId);
  const selectableWarehouses = warehouses?.filter((w) => w.id !== currentWarehouseId) || [];
  const warehouseOptions = selectableWarehouses.map((wh) => ({
    label: wh.name,
    value: wh.id.toString(),
  }));

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('common.transfer_warehouse')}</DialogTitle>
            <DialogDescription>{t('common.transfer_description')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentWarehouse">{t('common.current_warehouse')}</Label>
              <Input
                id="currentWarehouse"
                value={currentWarehouse?.name || 'Not assigned'}
                disabled
                className="rounded-full hover:border-red-200"
              />
            </div>

            <FormSelect
              name="transfer_to"
              label={t('common.transfer_to')}
              placeholder={t('common.select_warehouse')}
              options={warehouseOptions}
              className="rounded-full w-full"
            />
          </div>

          <DialogFooter className="flex justify-center ">
            <Button
              onClick={handleSubmit}
              className="w-full rounded-full bg-amber-400 hover:bg-amber-500 text-white"
            >
              {isLoading ? t('common.transferring') : t('common.transfer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
