import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import TwoButton from '@/components/common/ChoiceDualButtons';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promotionSchema, type PromotionValues } from '@/utils/validations/promotions';
import type { PromotionRequestPayload } from '@/common/types/promotionTypes';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import { FormTextarea } from '../context/FormTextarea';
import { FormDatePicker } from '../context/FormDatePicker';
import { useAllProductCategoriesQuery } from '@/features/api/products/productCateogry';
import { useAllProductsQuery } from '@/features/api/products/productApi';
import { FilePicker } from '@/components/common/FilePicker';
import {
  useAddPromotionMutation,
  useEditPromotionMutation,
  usePromotionDetailsQuery,
  useUploadPromotionImageMutation,
} from '@/features/api/promotions/promotionsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import type { PromotionProduct } from '@/common/types/promotionTypes';
import { formatDateToMySQL } from '@/utils/dataFormat';
import { DynamicIcon } from 'lucide-react/dynamic';

export default function AddProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const statusOptions = [
    { label: t('common.available'), value: '1' },
    { label: t('common.unavailable'), value: '0' },
  ];
  const { data: promotion, isLoading: isLoad } = usePromotionDetailsQuery(
    id ? (id as string) : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: productCategory, isLoading: isLoadingProductCategory } =
    useAllProductCategoriesQuery();
  const { data: products, isLoading: isLoadingProducts } = useAllProductsQuery();
  const [uploadImage, { isLoading: isLoadingImage }] = useUploadPromotionImageMutation();
  const [addPromotion, { isLoading }] = useAddPromotionMutation();
  const [editPromotion, { isLoading: isLoadingEdit }] = useEditPromotionMutation();

  const schema = useMemo(() => promotionSchema(t), [t]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      ar_name: '',
      description: '',
      ar_description: '',
      product_category_id: '',
      images: ['', '', '', ''],
      code: '',
      price: 0,
      status: '1',
      quantity: 0,
      promotion_end_date: undefined,
      product_ids: [],
      promotion_quantities: [],
    },
  });

  // useEffect(() => {
  //   methods.trigger();
  // }, [methods, t]);

  const selectedImages = useWatch({
    name: 'images',
    control: methods.control,
  });

  const expiryDate = useWatch({
    name: 'promotion_end_date',
    control: methods.control,
  });

  const selectedProducts = useWatch({
    name: 'product_ids',
    control: methods.control,
  });

  useEffect(() => {
    if (selectedProducts) {
      const currentQuantities = methods.getValues('promotion_quantities') || [];
      const newQuantities = selectedProducts.map((_, index) => currentQuantities[index] || 0);
      methods.setValue('promotion_quantities', newQuantities);
    }
  }, [selectedProducts, methods]);

  const setExpiryDate = (date: Date | undefined) => {
    if (date) {
      methods.setValue('promotion_end_date', date);
      methods.trigger('promotion_end_date');
    }
  };

  const handleDiscard = () => {
    navigate('/promotions');
  };

  const handleSubmit = async (formData: PromotionValues) => {
    const promotion_products = formData.product_ids.map((id, index) => ({
      product_id: id,
      quantity: formData.promotion_quantities?.[index] || 0,
    }));

    const payload: PromotionRequestPayload = {
      name: formData.name,
      ar_name: formData.ar_name,
      code: formData.code,
      description: formData.description,
      ar_description: formData.ar_description,
      quantity: formData.quantity,
      product_category_id: formData.product_category_id,
      price: formData.price,
      status: formData.status,
      promotion_end_date: formData.promotion_end_date
        ? formatDateToMySQL(formData.promotion_end_date)
        : undefined,
      images: formData.images.filter((img) => img.trim() !== ''),
      promotion_products,
    };

    if (promotion) {
      await editPromotion({ id: promotion.id, data: payload }).unwrap();
    } else {
      await addPromotion(payload).unwrap();
    }

    handleDiscard();
  };

  const productCategoryOptions = useMemo(() => {
    if (productCategory)
      return productCategory?.map((category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
    else return [];
  }, [productCategory]);

  const productOptions = useMemo(() => {
    if (products)
      return products?.map((product) => ({
        label: product.name,
        value: product.id.toString(),
      }));
    else return [];
  }, [products]);

  const onFileUpload = async (file: File | null, index: number) => {
    if (file) {
      const res = await uploadImage({ image: file }).unwrap();
      methods.setValue(`images.${index}`, res.data.image);
      methods.trigger('images');
    } else {
      methods.setValue(`images.${index}`, '');
      methods.trigger('images');
    }
  };

  useEffect(() => {
    if (promotion && products && productCategory) {
      const productIds =
        promotion.prmotion_products?.map((item: PromotionProduct) => item.product_id) || [];
      const quantities =
        promotion.prmotion_products?.map((item: PromotionProduct) => item.quantity) || [];
      methods.reset({
        name: promotion.name,
        ar_name: promotion.ar_name,
        code: promotion.code,
        description: promotion.description,
        ar_description: promotion.ar_description,
        images: promotion.images.map((i) => i.image),
        promotion_end_date: new Date(promotion.promotion_end_date),
        quantity: Number(promotion.quantity),
        price: Number(promotion.price),
        status: (String(promotion.status) === '0' ? '0' : '1') as '0' | '1',
        product_category_id: String(promotion.product_category_id),
        product_ids: productIds,
        promotion_quantities: quantities,
      });
      setTimeout(() => {
        methods.setValue('product_ids', productIds);
        methods.setValue('promotion_quantities', quantities);
        methods.setValue('product_category_id', String(promotion.product_category_id));
        methods.setValue('status', String(promotion.status) as '0' | '1');
      }, 50);
    }
  }, [promotion, products, productCategory, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="grid lg:grid-cols-[55%_45%] gap-6 xs:grid-col-1 lg:pr-4"
      >
        {isLoad && <DynamicIcon name="loader" size={26} className="animate-spin" />}
        {!id || promotion ? (
          <>
            <Card className="space-y-1 rounded-[20px] shadow-md p-6">
              <div>
                <h2 className="text-xl font-bold mb-3">{t('common.promotion_details')}</h2>
                <p>{t('common.promotion_details_description')}</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label className="ml-1 font-bold" htmlFor="name">
                    {t('common.promotion_name')}
                  </Label>
                  <FormInput
                    id="name"
                    name="name"
                    type="text"
                    className="rounded-full h-[50px] px-4 text-sm"
                    placeholder={t('common.enter_promotion_name')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="ml-1 font-bold" htmlFor="ar_name">
                    {t('common.ar_promotion_name')}
                  </Label>
                  <FormInput
                    id="ar_name"
                    name="ar_name"
                    type="text"
                    className="rounded-full h-[50px] px-4 text-sm"
                    placeholder={t('common.enter_promotion_name')}
                  />
                </div>

                <div className="flex flex-col sm:flex-wrap gap-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-2 ">
                      <Label className="mx-1 font-bold" htmlFor="code">
                        {t('common.promotion_code')}
                      </Label>
                      <FormInput
                        id="code"
                        name="code"
                        className="rounded-full h-[50px] px-4 text-sm"
                        placeholder={t('common.enter') + ' ' + t('common.promotion_code')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="mx-1 font-bold" htmlFor="category">
                        {t('common.product') + ' ' + t('common.category')}
                      </Label>
                      <FormSelect
                        className="rounded-full !h-[50px] px-4 text-sm"
                        placeholder={t('common.select') + ' ' + t('common.category')}
                        name="product_category_id"
                        options={productCategoryOptions}
                        disabled={isLoadingProductCategory}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="mx-1 font-bold" htmlFor="product_ids">
                        {t('common.products')}
                      </Label>
                      <FormSelect
                        className="rounded-full !h-[50px] px-4 text-sm"
                        placeholder={t('common.select') + ' ' + t('common.product')}
                        name="product_ids"
                        multiple
                        options={productOptions}
                        disabled={isLoadingProducts}
                      />
                    </div>
                  </div>

                  {selectedProducts && selectedProducts.length > 0 && (
                    <div>
                      {selectedProducts.map((productId: string, index: number) => {
                        const product = products?.find((p) => p.id.toString() === productId);
                        const originalQuantity = product ? Number(product.quantity) : 0;
                        const originalPrice = product ? Number(product.price) : 0;
                        return (
                          <div key={productId} className="sm:grid sm:grid-cols-2 sm:gap-4">
                            <div className="flex flex-col gap-2">
                              <Label
                                htmlFor={`product_name_${productId}`}
                                className="mx-1 font-bold"
                              >
                                {t('common.product_name')}
                              </Label>
                              <FormInput
                                id={`product_${productId}`}
                                type="text"
                                name={`${product?.name}`}
                                className="rounded-full h-[50px] px-4 text-sm"
                                placeholder={`${product?.name}`}
                                disabled
                              />
                              <div className="flex justify-end m-2">
                                <p className="text-sm text-gray-500">
                                  {t('common.product_price')}: {originalPrice}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label
                                htmlFor={`product_name_${productId}`}
                                className="font-bold mx-1"
                              >
                                {t('common.quantity')}
                              </Label>
                              <FormInput
                                id={`product_quantity_${productId}`}
                                name={`promotion_quantities.${index}`}
                                type="number"
                                className="rounded-full h-[50px] px-4 text-sm"
                                placeholder={t('common.enter_quantity')}
                                min={0}
                              />

                              <div className="flex justify-end m-2">
                                <p className="text-sm text-gray-500">
                                  {t('common.product_quantity')}: {originalQuantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="ml-1 font-bold" htmlFor="promotion_end_date">
                        {t('common.promotion_expiry')}
                      </Label>
                      <FormDatePicker
                        name="promotion_end_date"
                        className="rounded-full !h-[50px] px-4"
                        placeholder={t('common.select_promotion_expiry')}
                        value={expiryDate}
                        onChange={setExpiryDate}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="ml-1 font-bold" htmlFor="price">
                        {t('common.price')}
                      </Label>
                      <FormInput
                        id="price"
                        name="price"
                        type="number"
                        className="rounded-full h-[50px] px-4"
                        placeholder={t('common.enter_price')}
                        min={0}
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <Label className="ml-1 font-bold" htmlFor="quantity">
                        {t('common.quantity')}
                      </Label>
                      <FormInput
                        id="quantity"
                        name="quantity"
                        type="number"
                        className="rounded-full h-[50px] px-4"
                        placeholder={t('common.enter_quantity')}
                        min={0}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="mx-1 font-bold" htmlFor="status">
                        {t('common.status')}
                      </Label>
                      <FormSelect
                        className="rounded-full !h-[50px] px-4 text-sm"
                        placeholder={t('common.select_status')}
                        name="status"
                        options={statusOptions}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label className="ml-1 font-bold" htmlFor="description">
                    {t('common.promotion_description')}
                  </Label>
                  <FormTextarea
                    id="description"
                    name="description"
                    className="rounded-[16px] h-[50px] px-4"
                    placeholder={t('common.enter_description')}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label className="ml-1 font-bold" htmlFor="ar_description">
                    {t('common.ar_promotion_description')}
                  </Label>
                  <FormTextarea
                    id="ar_description"
                    name="ar_description"
                    className="rounded-[16px] h-[50px] px-4"
                    placeholder={t('common.enter_description')}
                  />
                </div>
              </div>
            </Card>
            <div>
              <Card className="rounded-[20px] shadow-md border p-6 h-fit">
                <h2 className="text-xl font-bold mb-1">{t('common.promotion_image')}</h2>
                <p className="mb-6">
                  <span className="text-amber-500 font-semibold">{t('common.note')}: </span>
                  <span className="text-gray-500 font-normal">
                    {t('common.image_instructions')}
                  </span>
                </p>
                <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 xs:grid-rows-2 xl:grid-rows-1 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={`file-${index + 1}`}>
                      <FilePicker
                        id={`image-${index}`}
                        className="w-full"
                        onChange={(file) => onFileUpload(file, index)}
                        value={selectedImages?.[index]}
                        disabled={isLoadingImage}
                      />
                    </div>
                  ))}
                </div>
                {isLoadingImage && <DynamicIcon name="loader" size={20} className="animate-spin" />}
                {methods.formState.errors.images && (
                  <span className="text-red-500 text-sm">
                    {methods.formState.errors.images.message}
                  </span>
                )}
              </Card>
              <div className="mt-5">
                <TwoButton
                  justify="between"
                  buttonData={[t('common.save'), t('common.discard')]}
                  onCancel={handleDiscard}
                  onConfirm={() => {}}
                  confirmType="submit"
                  loading={isLoading || isLoadingImage || isLoadingEdit}
                />
              </div>
            </div>
          </>
        ) : null}
      </form>
    </FormProvider>
  );
}
