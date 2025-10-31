import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import TwoButton from '@/components/common/ChoiceDualButtons';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductValues } from '@/utils/validations/product';
import { FormInput } from '../context/FormInput';
import { FormSelect } from '../context/FormSelect';
import { FormTextarea } from '../context/FormTextarea';
import { useAllChildProductCategoriesQuery } from '@/features/api/products/productCateogry';
import { FilePicker } from '@/components/common/FilePicker';
import {
  useAddProductMutation,
  useEditProductMutation,
  useProductDetailsQuery,
  useUploadProductImageMutation,
} from '@/features/api/products/productApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useAllProductUnitsQuery } from '@/features/api/products/productUnitApi';
import i18n from '@/languages';

export default function AddProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRtl = i18n?.dir() === 'rtl';

  const statusOptions = [
    { label: t('common.available'), value: '1' },
    { label: t('common.unavailable'), value: '0' },
  ];

  const { data: product, isLoading: isLoad } = useProductDetailsQuery(
    id ? (id as string) : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: productCategory, isLoading: isLoadingProductCategory } =
    useAllChildProductCategoriesQuery();
  const { data: productUnits, isLoading: isLoadingProductUnit } = useAllProductUnitsQuery();

  const [uploadImage, { isLoading: isLoadingImage }] = useUploadProductImageMutation();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: isLoadingEdit }] = useEditProductMutation();

  const schema = useMemo(() => productSchema(t), [t]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      ar_name: '',
      description: '',
      ar_description: '',
      product_category_id: '',
      product_unit_id: '',
      uom_product_unit_id: undefined,
      is_uom_small: '0',
      pieces_per_box: '0',
      images: ['', '', '', ''],
      code: '',
      quantity: 0,
      price: 0,
      status: '1',
    },
    mode: 'onSubmit',
  });

  // useEffect(() => {
  //   methods.trigger();
  // }, [methods, t]);

  const selectedImages = useWatch({
    name: 'images',
    control: methods.control,
  });

  const isUOM = useWatch({
    name: 'is_uom_small',
    control: methods.control,
  });

  const uomUnit = useWatch({
    name: 'uom_product_unit_id',
    control: methods.control,
  });

  const quantity = useWatch({
    name: 'quantity',
    control: methods.control,
  });

  const piecesPerBox = useWatch({
    name: 'pieces_per_box',
    control: methods.control,
  });

  const totalBoxes = useMemo(() => {
    const qty = Number(quantity);
    const perBox = Number(piecesPerBox);

    if (perBox > 0 && qty >= 0) {
      return Math.floor(qty / perBox);
    } else if (qty === 0) {
      return 0;
    } else {
      return null;
    }
  }, [piecesPerBox, quantity]);

  const productUnitOptions = useMemo(() => {
    if (productUnits)
      return productUnits?.map((unit) => ({
        label: isRtl ? unit.ar_name : unit.name,
        value: unit.id.toString(),
      }));
    else return [];
  }, [productUnits, isRtl]);

  const UomSelectUnit = useMemo(() => {
    if (uomUnit) {
      return productUnitOptions.find((unit) => unit.value === uomUnit);
    } else return null;
  }, [uomUnit, productUnitOptions]);

  const handleDiscard = () => {
    navigate('/products');
  };

  const handleSubmit = async (formData: ProductValues) => {
    const payload = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ''),
    };
    if (payload.is_uom_small === '0') {
      delete payload.uom_product_unit_id;
    }
    if (product) {
      await editProduct({ id: product.id, data: payload }).unwrap();
    } else {
      await addProduct(payload).unwrap();
    }

    handleDiscard();
  };

  const productCategoryOptions = useMemo(() => {
    if (productCategory)
      return productCategory?.map((category) => ({
        label: isRtl ? category.ar_name : category.name,
        value: category.id.toString(),
      }));
    else return [];
  }, [productCategory, isRtl]);

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
    if (product) {
      methods.reset({
        name: product.name,
        ar_name: product.ar_name,
        code: product.code,
        quantity: Number(product.quantity),
        price: Number(product.price),
        pieces_per_box: product.pieces_per_box,
        description: product.description,
        ar_description: product.ar_description,
        images: product.images.map((i) => i.image),
        is_uom_small: String(product.is_uom_small) as '0' | '1',
        status: String(product.status) as '0' | '1',
        product_category_id: String(product.product_category_id),
      });

      setTimeout(() => {
        methods.setValue('product_unit_id', String(product.product_unit_id));
        methods.setValue('is_uom_small', String(product.is_uom_small) as '0' | '1');
        methods.setValue('status', String(product.status) as '0' | '1');
        methods.setValue('product_category_id', String(product.product_category_id));
        methods.setValue('uom_product_unit_id', Number(product.uom_product_unit_id) || undefined);
      }, 50);
    }
  }, [product, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="grid lg:grid-cols-[55%_45%] gap-6 xs:grid-col-1 lg:pr-4"
      >
        {isLoad && <DynamicIcon name="loader" size={26} className="animate-spin" />}
        {!id || product ? (
          <>
            <Card className="space-y-1 rounded-[20px] shadow-md p-6">
              <div>
                <h2 className="text-xl font-bold mb-3">{t('common.product_details')}</h2>
                <p>{t('common.product_details_description')}</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label className="ml-1 font-bold" htmlFor="name">
                    {t('common.product_name')}
                  </Label>
                  <FormInput
                    id="name"
                    name="name"
                    type="text"
                    className="rounded-full h-[50px] px-4"
                    placeholder={t('common.enter_product_name')}
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="flex flex-col gap-2 col-span-6">
                    <div className="flex flex-col gap-2">
                      <Label className="ml-1 font-bold" htmlFor="ar_name">
                        {t('common.ar_product_name')}
                      </Label>
                      <FormInput
                        id="ar_name"
                        name="ar_name"
                        type="text"
                        className="rounded-full h-[50px] px-4"
                        placeholder={t('common.enter_product_name')}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="category">
                      {t('common.product_unit')}
                    </Label>
                    <FormSelect
                      className="rounded-full !h-[50px] px-4"
                      placeholder={t('common.select') + ' ' + t('common.product_unit')}
                      name="product_unit_id"
                      options={productUnitOptions}
                      disabled={isLoadingProductUnit}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="code">
                      {t('common.code')}
                    </Label>
                    <FormInput
                      id="code"
                      name="code"
                      className="rounded-full h-[50px] px-4"
                      placeholder={t('common.enter') + ' ' + t('common.code')}
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="quantity">
                      {t('common.quantity')}
                    </Label>
                    <FormInput
                      id="quantity"
                      name="quantity"
                      className="rounded-full h-[50px] px-4"
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="category">
                      {t('common.product') + ' ' + t('common.category')}
                    </Label>
                    <FormSelect
                      className="rounded-full !h-[50px] px-4"
                      placeholder={
                        t('common.select') + ' ' + t('common.product') + ' ' + t('common.category')
                      }
                      name="product_category_id"
                      options={productCategoryOptions}
                      disabled={isLoadingProductCategory}
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="price">
                      {t('common.price')}
                    </Label>
                    <FormInput
                      id="price"
                      name="price"
                      className="rounded-full h-[50px] px-4"
                      placeholder={t('common.enter_price')}
                      min={0}
                    />
                  </div>

                  <div className="flex flex-row items-center gap-2 col-span-6">
                    <Checkbox
                      id="is_uom_small"
                      className="data-[state=checked]:text-black dark:data-[state=checked]:text-white dark:data-[state=checked]:bg-amber-400"
                      checked={isUOM === '1'}
                      onCheckedChange={(checked: boolean) => {
                        methods.setValue('is_uom_small', checked ? '1' : '0');
                      }}
                    />
                    <Label className="ml-1 font-bold" htmlFor="uomSmall">
                      {t('common.uomSmall')}
                    </Label>
                  </div>
                  {isUOM === '1' ? (
                    <>
                      <div className="flex flex-col gap-2 col-span-6">
                        <Label className="ml-1 font-bold" htmlFor="category">
                          {t('common.product_unit')}
                        </Label>
                        <FormSelect
                          className="rounded-full !h-[50px] px-4"
                          placeholder={t('common.select') + ' ' + t('common.product_unit')}
                          name="uom_product_unit_id"
                          options={productUnitOptions}
                          disabled={isLoadingProductUnit}
                        />
                      </div>
                      {UomSelectUnit && (
                        <div className="flex flex-col gap-2 col-span-6">
                          <Label className="ml-1 font-bold" htmlFor="pp">
                            {t('common.pp')} {UomSelectUnit.label}
                          </Label>
                          <FormInput
                            id="pp"
                            name="pieces_per_box"
                            type="number"
                            className="rounded-full h-[50px] px-4"
                            placeholder={
                              t('common.enter') + ' ' + t('common.pp') + ' ' + UomSelectUnit.label
                            }
                            min={0}
                          />
                          {totalBoxes && totalBoxes > 0 ? (
                            <p className="text-[15px]">
                              {t('common.total')} {UomSelectUnit.label}&nbsp;:&nbsp;
                              <b>{totalBoxes}</b>
                            </p>
                          ) : null}
                        </div>
                      )}
                    </>
                  ) : null}
                  <div className="flex flex-col gap-2 col-span-6">
                    <Label className="ml-1 font-bold" htmlFor="status">
                      {t('common.status')}
                    </Label>
                    <FormSelect
                      className="rounded-full !h-[50px] px-4"
                      placeholder={t('common.select_status')}
                      name="status"
                      options={statusOptions}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label className="ml-1 font-bold" htmlFor="description">
                    {t('common.product_description')}
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
                    {t('common.ar_product_description')}
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
              <Card className=" rounded-[20px] shadow-md border p-6 h-fit">
                <h2 className="text-xl font-bold mb-1">{t('common.product_images')}</h2>
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
