import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import type { Region, RegionPayload, RegionStatusOption } from '@/common/types/regionTypes';
import { regionSchema, type RegionValues } from '@/utils/validations/region';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: RegionPayload) => void;
  loading?: boolean;
  editData?: Region | null;
};

export default function AddRegionDialog({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();

  const SelectOptions: RegionStatusOption[] = [
    { label: t('common.active'), value: '1' },
    { label: t('common.inactive'), value: '0' },
  ];

  const methods = useForm<RegionValues>({
    resolver: zodResolver(regionSchema(t)),
    defaultValues: {
      name: '',
      ar_name: '',
      status: '1',
    },
  });

  const handleSubmit = (data: RegionPayload) => {
    onAdd(data);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name,
        ar_name: editData.ar_name,
        status: editData.status?.toString() as '0' | '1',
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
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.region')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.region') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="region-name">{t('common.en_region_name')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full"
                  id="region-name"
                  placeholder={t('common.enter_region_name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ar_region-name">{t('common.ar_region_name')}</Label>
                <FormInput
                  name="ar_name"
                  className="rounded-full"
                  id="region-name"
                  placeholder={t('common.enter_region_name')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('common.status')}</Label>
                <FormSelect name="status" className="rounded-full w-full" options={SelectOptions} />
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.region')
                      : t('common.add_new') + ' ' + t('common.region')
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
