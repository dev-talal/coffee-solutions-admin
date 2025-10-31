import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';
import { useWarehousesQuery } from '@/features/api/orders/ordersApi';

import type { Driver, DriverPayload } from '@/common/types/driverTypes';
import { driverSchema, type DriverFormValues } from '@/utils/validations/drivers/index';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: DriverPayload) => void;
  loading?: boolean;
  editData?: Driver | null;
};

export default function AddDrivers({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();

  const statusOptions = [
    { label: t('common.active'), value: '1' },
    { label: t('common.inactive'), value: '0' },
  ];

  const { data: warehouses = [] } = useWarehousesQuery();

  const warehouseOptions = warehouses.map((w) => ({
    label: w.name,
    value: w.id.toString(),
  }));

  const methods = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema(t)),
    defaultValues: {
      first_name: '',
      last_name: '',
      mobile_no: '',
      status: '1',
      warehouse_ids: [],
    },
  });

  const handleSubmit = async (data: DriverFormValues) => {
    const payload: DriverPayload = {
      ...data,
      status: Number(data.status),
      warehouse_ids: data.warehouse_ids.map((w) => ({ id: Number(w) })),
    };
    await onAdd(payload);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        ...editData,
        status: editData.status.toString(),
        warehouse_ids: editData.warehouses.map((w) => w.id.toString()),
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] bg-card text-card-foreground"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.driver')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.driver') + '.'}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="first_name">{t('common.first_name')}</Label>
                <FormInput
                  name="first_name"
                  className="rounded-full"
                  placeholder={t('common.enter') + ' ' + t('common.first_name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">{t('common.last_name')}</Label>
                <FormInput
                  name="last_name"
                  className="rounded-full"
                  placeholder={t('common.enter') + ' ' + t('common.last_name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_no">{t('common.phoneNumber')}</Label>
                <FormInput
                  name="mobile_no"
                  className="rounded-full"
                  placeholder={t('common.enter') + ' ' + t('common.phoneNumber')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('common.status')}</Label>
                <FormSelect name="status" className="rounded-full w-full" options={statusOptions} />
              </div>

              <div className="space-y-2">
                <Label>{t('common.warehouse')}</Label>
                <FormSelect
                  name="warehouse_ids"
                  className="rounded-full w-full"
                  placeholder={t('common.select') + ' ' + t('common.warehouses')}
                  options={warehouseOptions}
                  multiple={true}
                />
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.driver')
                      : t('common.add_new') + ' ' + t('common.driver')
                  }
                />
              </div>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
