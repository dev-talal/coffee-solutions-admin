import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { citySchema, type CityValues } from '@/utils/validations/region';
import type { City } from '@/common/types/cityTypes';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: CityValues) => void;
  loading?: boolean;
  editData?: City | null;
  region_id: string;
};

export default function AddCityDialog({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
  region_id,
}: Props) {
  const { t } = useTranslation();

  const methods = useForm<CityValues>({
    resolver: zodResolver(citySchema(t)),
    defaultValues: {
      name: '',
      ar_name: '',
      status: '1',
      region_id: region_id,
    },
  });

  const handleSubmit = (payload: CityValues) => {
    onAdd(payload);
  };

  const SelectOptions = [
    { label: t('common.status_active'), value: '1' },
    { label: t('common.status_inactive'), value: '0' },
  ];

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name,
        ar_name: editData.ar_name,
        status: editData.status,
        region_id: region_id,
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-card text-card-foreground pb-1">
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.city')}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2">
            <form className="space-y-4 py-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="city-name">{t('common.en_city_name')}</Label>
                <FormInput
                  id="city-name"
                  className="rounded-full"
                  name="name"
                  placeholder={t('common.city_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city-ar-name">{t('common.ar_city_name')}</Label>
                <FormInput
                  id="ar_name"
                  className="rounded-full"
                  name="ar_name"
                  placeholder={t('common.city_placeholder')}
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
                      ? t('common.update') + ' ' + t('common.city')
                      : t('common.add_new') + ' ' + t('common.city')
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
