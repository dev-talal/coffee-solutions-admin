import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSelect } from '../context/FormSelect';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';
import { useAllParentProductCategoriesQuery } from '@/features/api/products/productCateogry';

import type { Banner, BannerCategory } from '@/common/types/bannerTypes';
import { bannerSchema, type BannerFormValues } from '@/utils/validations/banner/index';
import { FilePicker } from '@/components/common/FilePicker';
import { useUploadBannerImageMutation } from '@/features/api/banner/bannerApi';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: BannerFormValues) => void;
  loading?: boolean;
  editData?: Banner | null;
};

export default function AddBanners({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t, i18n } = useTranslation();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useAllParentProductCategoriesQuery();
  const [uploadImage, { isLoading: isLoadingImage }] = useUploadBannerImageMutation();

  const categoryOptions =
    categories?.map((c: BannerCategory) => ({
      label: i18n.language === 'ar' ? c.ar_name : c.name,
      value: c.id.toString(),
    })) || [];

  const typeOptions = [
    { label: t('common.category'), value: 'category' },
    { label: t('common.promotion'), value: 'promotional' },
  ];

  const methods = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema(t)),
    defaultValues: {
      url: '',
      type: '',
      category_id: '',
    },
  });

  const selectedFile = methods.watch('url');
  const banenrType = methods.watch('type');

  const handleSubmit = async (data: BannerFormValues) => {
    await onAdd(data);
  };

  const handleUploadFile = async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const res = await uploadImage({ file }).unwrap();
      methods.setValue('url', res.data);
    } else {
      methods.setValue('url', '');
    }
    methods.trigger('url');
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        url: editData.url,
        type: editData.type,
      });
    }
  }, [editData, methods]);

  useEffect(() => {
    methods.register('url');
  }, []);

  useEffect(() => {
    if (banenrType !== 'category') {
      methods.setValue('category_id', '');
    }
  }, [banenrType]);

  useEffect(() => {
    if (categories && categories.length > 0 && editData?.category) {
      methods.setValue('category_id', editData.category?.id.toString());
    }
  }, [categories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] bg-card text-card-foreground"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('common.banner')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.banner') + '.'}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2">
            <form className="space-y-4" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label>{t('common.type')}</Label>
                <FormSelect name="type" className="rounded-full w-full" options={typeOptions} />
              </div>
              {banenrType === 'category' && !isLoadingCategories && (
                <div className="space-y-2">
                  <Label>{t('common.category')}</Label>

                  <FormSelect
                    name="category_id"
                    className="rounded-full w-full"
                    placeholder={t('common.select') + ' ' + t('common.category')}
                    options={categoryOptions}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="url">{t('common.image')}</Label>
                <FilePicker
                  onChange={handleUploadFile}
                  value={selectedFile}
                  disabled={isLoadingImage}
                />
                {methods.formState.errors.url && (
                  <span className="text-red-500 text-sm">
                    {methods.formState.errors.url.message}
                  </span>
                )}
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.banner')
                      : t('common.add_new') + ' ' + t('common.banner')
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
