import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../context/FormInput';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';
import type { ProductUnit } from '@/common/types/productTypes';
import { productUnitSchema, type ProductUnitValues } from '@/utils/validations/product';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: ProductUnitValues) => void;
  loading?: boolean;
  editData?: ProductUnit | null;
};

export default function AddProductUnitDialogue({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();

  const methods = useForm<ProductUnitValues>({
    resolver: zodResolver(productUnitSchema(t)),
    defaultValues: {
      name: '',
      ar_name: '',
    },
  });

  const handleSubmit = (data: ProductUnitValues) => {
    onAdd(data);
  };

  useEffect(() => {
    if (editData) {
      methods.reset(editData);
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
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.product_unit')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.product_unit') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="unit-name">{t('common.unit_name')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full"
                  id="unit-name"
                  placeholder={t('common.enter_unit_name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ar_unit_name">{t('common.ar_unit_name')}</Label>
                <FormInput
                  name="ar_name"
                  className="rounded-full"
                  id="ar_unit_name"
                  placeholder={t('common.enter_unit_name')}
                />
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.product_unit')
                      : t('common.add_new') + ' ' + t('common.product_unit')
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
