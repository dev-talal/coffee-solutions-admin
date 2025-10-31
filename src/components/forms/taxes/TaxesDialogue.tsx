import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import type { Taxes, TaxesPayload, TaxesStatusOption } from '@/common/types/taxesTypes';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { taxesSchema } from '@/utils/validations/taxes';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { name: string; rate: number; status: TaxesStatusOption['value'] }) => void;
  loading?: boolean;
  editData?: Taxes | null;
};

export default function TaxesDialog({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();

  const SelectOptions: TaxesStatusOption[] = [
    { label: t('common.active'), value: '1' },
    { label: t('common.inactive'), value: '0' },
  ];

  const methods = useForm({
    resolver: zodResolver(taxesSchema(t)),
    defaultValues: {
      name: '',
      rate: 0,
      status: '1',
    },
  });

  const handleSubmit = (data: TaxesPayload) => {
    onAdd(data);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name,
        rate: Number(editData.rate), // ensure numeric
        status: editData.status?.toString() as '0' | '1', // ✅ convert number → string
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-card">
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.tax')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.tax') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="tax-name">{t('common.tax_name')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full"
                  id="tax-name"
                  placeholder={t('common.enter') + ' ' + t('common.tax_name')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.rate')}</Label>
                <FormInput
                  name="rate"
                  className="rounded-full"
                  id="tax-rate"
                  placeholder={t('common.enter') + ' ' + t('common.rate')}
                  type="number"
                  min={0}
                  max={100}
                  icon="percent"
                  iconAlign="left"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.status')}</Label>
                <FormSelect name="status" className="rounded-full w-full" options={SelectOptions} />
              </div>

              <div className="pt-2">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.tax')
                      : t('common.add_new') + ' ' + t('common.tax')
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
