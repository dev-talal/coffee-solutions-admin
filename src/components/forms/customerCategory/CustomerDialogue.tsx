import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormSelect } from '../context/FormSelect';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../context/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerCategorySchema } from '@/utils/validations/customerCategory';
import type {
  CustomerCategory,
  CustomerCategoryPayload,
  CategoryStatusOption,
} from '@/common/types/customerCategoryTypes';
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { name: string; discount: number; status: CategoryStatusOption['value'] }) => void;
  loading?: boolean;
  editData?: CustomerCategory | null;
};

export default function AddDialog({ open, onOpenChange, onAdd, loading = false, editData }: Props) {
  const { t } = useTranslation();

  const StatusOptions: CategoryStatusOption[] = [
    { label: t('common.active'), value: '1' },
    { label: t('common.inactive'), value: '0' },
  ];
  const methods = useForm({
    resolver: zodResolver(customerCategorySchema(t)),
    defaultValues: {
      name: '',
      discount: 0,
      status: '1',
    },
  });

  const handleSubmit = (data: CustomerCategoryPayload) => {
    onAdd(data);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name,
        discount: Number(editData.discount),
        status: editData.status === 1 ? '1' : '0',
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>
            {editData ? t('common.edit') : t('common.add_new')} {t('common.customerCategory')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.customerCategory') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form className="space-y-4 w-full" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="category-name">{t('common.categoryName')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full w-full"
                  placeholder={t('common.enter_category')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-discount">{t('common.discount')} (%)</Label>
                <FormInput
                  name="discount"
                  className="rounded-full"
                  id="category-discount"
                  placeholder={t('common.discount_placeholder')}
                  type="number"
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('common.status')}</Label>
                <FormSelect name="status" className="rounded-full w-full" options={StatusOptions} />
              </div>
              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full "
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.customerCategory')
                      : t('common.add_new') + ' ' + t('common.customerCategory')
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
