import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Warehouse } from '@/common/types/warehouseTypes';
import { warehouseSchema, type WarehouseFormValues } from '@/utils/validations/warehouse';
import { useAllRegionsQuery } from '@/features/api/regions/regionApi';
import { cn } from '@/lib/utils';
import LoadingButton from '@/components/common/LoadingButton';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: WarehouseFormValues) => void;
  loading?: boolean;
  editData?: Warehouse | null;
};

export default function AddWarehouseDialog({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();
  const { data: regions, isLoading: isRegionsLoading } = useAllRegionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const method = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema(t)),
    defaultValues: {
      name: '',
      region_ids: [],
      status: '1',
    },
  });

  const handleSubmit = (data: WarehouseFormValues) => {
    onAdd(data);
  };

  const regionsOptions = useMemo(() => {
    if (regions) return regions?.map(({ id, name }) => ({ label: name, value: id.toString() }));
    else return [];
  }, [regions]);

  useEffect(() => {
    if (editData) {
      method.reset({
        name: editData.name,
        ar_name: editData.ar_name,
        region_ids: editData.regions?.map((item) => item.id.toString()) || [],
        status: editData.status?.toString() as '0' | '1',
      });
    }
  }, [editData, method]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-card">
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.warehouse')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.warehouse') + '. '}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...method}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form onSubmit={method.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInput
                  name="name"
                  placeholder={t('common.enter_name')}
                  className="rounded-full"
                  label={t('common.warehouse_name')}
                />

                <FormInput
                  name="ar_name"
                  placeholder={t('common.enter_name')}
                  className="rounded-full"
                  label={t('common.ar_warehouse_name')}
                />

                <FormSelect
                  name="region_ids"
                  disabled={isRegionsLoading}
                  placeholder={t('common.select_region')}
                  className="rounded-full w-full"
                  options={regionsOptions}
                  label={t('common.region')}
                  multiple={true}
                />

                <FormSelect
                  name="status"
                  className="rounded-full w-full"
                  options={[
                    { label: t('common.active'), value: '1' },
                    { label: t('common.inactive'), value: '0' },
                  ]}
                  label={t('common.status')}
                />
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={editData ? t('common.update_warehouse') : t('common.add_warehouse')}
                />
              </div>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
