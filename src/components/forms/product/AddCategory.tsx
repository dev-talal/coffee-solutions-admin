import { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormSelect } from '../context/FormSelect';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../context/FormInput';
import { useTranslation } from 'react-i18next';
import { FormFile } from '../context/FormFile';
import LoadingButton from '@/components/common/LoadingButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAllProductCategoriesQuery } from '@/features/api/products/productCateogry';
import { productCategorySchema } from '@/utils/validations/productsCategory/index';
import type {
  Product,
  ProductPayload,
  ProductStatusOption,
} from '@/common/types/productCategoryTypes';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: ProductPayload) => void;
  loading?: boolean;
  editData?: Product | null;
};

export default function AddDialog({ open, onOpenChange, onAdd, loading = false, editData }: Props) {
  const { t } = useTranslation();
  const { data: productCategory, isLoading: isLoadingProductCategory } =
    useAllProductCategoriesQuery();

  const StatusOptions: ProductStatusOption[] = [
    { label: t('common.active'), value: '1' },
    { label: t('common.inactive'), value: '0' },
  ];
  const methods = useForm({
    resolver: zodResolver(productCategorySchema(t)),
    defaultValues: {
      name: '',
      ar_name: '',
      icon: '',
      parent_id: '',
      status: '1' as '0' | '1',
    },
  });

  const productCategoryOptions = useMemo(() => {
    if (!productCategory) return [];

    return productCategory
      .filter((category) => category.id !== editData?.id)
      .map((category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
  }, [productCategory, editData]);

  const handleSubmit = (data: ProductPayload) => {
    const payload: ProductPayload = {
      name: data.name,
      ar_name: data.ar_name,
      icon: data.icon,
      status: data.status,
      parent_id: data.parent_id,
    };

    onAdd(payload);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name,
        ar_name: editData.ar_name,
        icon: editData.icon,
        parent_id: editData.parent_id ? editData.parent_id.toString() : '',
        status: editData.status?.toString() as '0' | '1',
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>
            {editData ? t('common.edit') : t('common.add_new')} {t('common.productsCategory')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.productsCategory') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="category-name">{t('common.categoryName')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full w-full"
                  placeholder={t('common.enter_category')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ar_name">{t('common.ar_categoryName')}</Label>
                <FormInput
                  name="ar_name"
                  className="rounded-full w-full"
                  placeholder={t('common.enter_category')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_id">{t('common.parent') + ' ' + t('common.category')}</Label>
                <FormSelect
                  className="rounded-full w-full"
                  placeholder={
                    t('common.select') + ' ' + t('common.parent') + ' ' + t('common.category')
                  }
                  name="parent_id"
                  options={productCategoryOptions}
                  disabled={isLoadingProductCategory}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.status')}</Label>
                <FormSelect name="status" className="rounded-full w-full" options={StatusOptions} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-discount">{t('common.icon')}</Label>
                <FormFile name="icon" className="rounded-xl" id="category-icon" />
              </div>
              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.category')
                      : t('common.add_new') + ' ' + t('common.category')
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
