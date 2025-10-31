import { useMemo, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormInput } from '../context/FormInput';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerValues } from '@/utils/validations/customer';
import { useTranslation } from 'react-i18next';
import type { Customer } from '@/common/types/customerTypes';
import LoadingButton from '@/components/common/LoadingButton';
import {
  useAllRegionsQuery,
  useGetWareHousesandCitiesByRegionQuery,
} from '@/features/api/regions/regionApi';
import { addressFields, formatOptions, formatUsersOptions } from '@/helpers/dataFormat';
import { FormSelect } from '../context/FormSelect';
import { useAllCustomerCategoriesQuery } from '@/features/api/customer/CustomerCategoryApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCustomerCareUsersByWarehouseQuery } from '@/features/api/warehouse/wareHouseApi';
import { FormPhoneInput } from '../context/FormPhoneInput';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: CustomerValues) => void;
  loading?: boolean;
  editData?: Customer | null;
};

export default function CustomerDialog({
  open,
  onOpenChange,
  onAdd,
  loading = false,
  editData,
}: Props) {
  const { t } = useTranslation();
  const { data: regions, isLoading: isLoadingRegions } = useAllRegionsQuery();
  const { data: categories, isLoading: isLoadingCategories } = useAllCustomerCategoriesQuery();
  const hasChangedWarehouse = useRef(false);
  const hasChangedRegion = useRef(false);
  const methods = useForm({
    resolver: zodResolver(customerSchema(t)),
    defaultValues: {
      region_id: '',
      city_id: '',
      warehouse_id: '',
      customer_category_id: '',
      customer_care_id: '',
      sales_id: '',
      credit_limit: 0,
      company_name: '',
      ar_company_name: '',
      is_link: 2,
    },
  });

  const addressLinkValue = useWatch({ name: 'is_link', control: methods.control });
  const selectedRegion = useWatch({ name: 'region_id', control: methods.control });
  const selectedWarehouse = useWatch({ name: 'warehouse_id', control: methods.control });

  const { data: citiesWarehouses, isLoading: isLoadingWarehouses } =
    useGetWareHousesandCitiesByRegionQuery(selectedRegion ? (selectedRegion as string) : skipToken);

  const { data: customerCareusers, isLoading: isLoadingCustomerCare } =
    useCustomerCareUsersByWarehouseQuery(
      selectedWarehouse ? (selectedWarehouse as string) : skipToken,
    );

  const handleSubmit = (data: CustomerValues) => {
    onAdd(data);
  };
  const isLink =
    editData?.delivery_address?.is_link == 1 ? 1 : editData?.delivery_address?.is_link == 0 ? 0 : 2;
  useEffect(() => {
    if (!editData) return;
    const commonData = {
      ...editData,
      region_id: editData.region.id.toString(),
      city_id: editData.city.id.toString(),
      warehouse_id: editData.warehouse.id.toString(),
      customer_category_id: editData.customer_category_id.toString(),
      customer_care_id: editData.customer_care_id.toString(),
      address_id: editData.delivery_address?.id,
    };

    if (isLink === 0) {
      methods.reset({
        ...commonData,
        ...editData.delivery_address,
        is_link: 0 as const,
      });
    } else if (isLink === 1) {
      methods.reset({
        ...commonData,
        ...editData.delivery_address,
        is_link: 1 as const,
      });
    } else {
      methods.reset({
        ...commonData,
        ...editData.delivery_address,
        is_link: 2 as const,
      });
    }
  }, [editData, methods, isLink]);

  const regionsOptions = useMemo(() => formatOptions(regions), [regions]);
  const categoriesOptions = useMemo(() => formatOptions(categories), [categories]);
  const citiesOptions = useMemo(() => formatOptions(citiesWarehouses?.cities), [citiesWarehouses]);
  const warehousesOptions = useMemo(
    () => formatOptions(citiesWarehouses?.warehouses),
    [citiesWarehouses],
  );

  const customerCareUsersOptions = useMemo(
    () => formatUsersOptions(customerCareusers?.customer_care_users),
    [customerCareusers],
  );

  const salesUsersOptions = useMemo(
    () => formatUsersOptions(customerCareusers?.sales_users),
    [customerCareusers],
  );

  useEffect(() => {
    if (selectedWarehouse) {
      if (editData && !hasChangedWarehouse.current) {
        hasChangedWarehouse.current = true;
        return;
      }

      methods.setValue('sales_id', '');
      methods.setValue('customer_care_id', '');
    }
  }, [selectedWarehouse, editData, methods]);

  useEffect(() => {
    if (selectedRegion) {
      if (editData && !hasChangedRegion.current) {
        hasChangedRegion.current = true;
        return;
      }
      methods.setValue('sales_id', '');
      methods.setValue('customer_care_id', '');
      methods.setValue('warehouse_id', '');
      methods.setValue('city_id', '');
    }
  }, [selectedRegion, editData, methods]);

  const DeliveryOptions = [
    {
      id: 1,
      label: t('common.locationLink'),
    },
    {
      id: 0,
      label: t('common.addressDetails'),
    },
    {
      id: 2,
      label: t('common.none'),
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-4xl max-h-[90vh] bg-card text-card-foreground flex flex-col scrollbar-none">
        <DialogHeader>
          <DialogTitle>
            {editData ? t('common.edit') : t('common.add_new')} {t('common.customer')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.customer') + '. '}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2 ">
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">{t('common.first_name')}</Label>
                  <FormInput
                    name="first_name"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.first_name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">{t('common.last_name')}</Label>
                  <FormInput
                    name="last_name"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.last_name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <FormInput
                    name="email"
                    type="email"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.email')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('common.phoneNumber')}</Label>
                  <FormPhoneInput placeholder={t('common.enter') + ' ' + t('common.phoneNumber')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">{t('common.company_name')}</Label>
                  <FormInput
                    name="company_name"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.company_name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ar_company_name">{t('common.ar_company_name')}</Label>
                  <FormInput
                    name="ar_company_name"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.ar_company_name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_code">{t('common.customerCode')}</Label>
                  <FormInput
                    name="customer_code"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.customerCode')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_number">{t('common.registrationNumber')}</Label>
                  <FormInput
                    name="registration_number"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.registrationNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat_number">{t('common.vatNumber')}</Label>
                  <FormInput
                    name="vat_number"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.vatNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region_id">{t('common.region')}</Label>
                  <FormSelect
                    options={regionsOptions}
                    name="region_id"
                    className="w-full rounded-full"
                    disabled={isLoadingRegions}
                    placeholder={t('common.select') + ' ' + t('common.region')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city_id">{t('common.city')}</Label>
                  <FormSelect
                    options={citiesOptions}
                    placeholder={t('common.select') + ' ' + t('common.city')}
                    name="city_id"
                    disabled={!selectedRegion || isLoadingWarehouses}
                    className="w-full rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse_id">{t('common.warehouse')}</Label>
                  <FormSelect
                    options={warehousesOptions}
                    placeholder={t('common.select') + ' ' + t('common.warehouse')}
                    name="warehouse_id"
                    disabled={!selectedRegion || isLoadingWarehouses}
                    className="w-full rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_category_id">{t('common.customerCategory')}</Label>
                  <FormSelect
                    options={categoriesOptions}
                    placeholder={t('common.select') + ' ' + t('common.customerCategory')}
                    name="customer_category_id"
                    className="w-full rounded-full"
                    disabled={isLoadingCategories}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_care_id">{t('common.customerCare')}</Label>
                  <FormSelect
                    options={customerCareUsersOptions}
                    placeholder={t('common.select') + ' ' + t('common.customerCare')}
                    name="customer_care_id"
                    className="w-full rounded-full"
                    disabled={!selectedWarehouse || isLoadingCustomerCare}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales_id">{t('common.sales')}</Label>
                  <FormSelect
                    options={salesUsersOptions}
                    placeholder={t('common.select') + ' ' + t('common.sales')}
                    name="sales_id"
                    className="w-full rounded-full"
                    disabled={!selectedWarehouse || isLoadingCustomerCare}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_limit">{t('common.creditLimit')}</Label>
                  <FormInput
                    name="credit_limit"
                    type="number"
                    min={0}
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('common.creditLimit')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <FormInput
                    name="password"
                    type="password"
                    className="rounded-full"
                    placeholder={t('common.enter') + ' ' + t('login.password')}
                    isPassword={true}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_address">{t('common.deliveryAddress')}</Label>
                <div className="flex items-center space-x-4">
                  {DeliveryOptions.map((option) => (
                    <div key={option.label} className="flex items-center space-x-2 my-4">
                      <Checkbox
                        id={option.label}
                        checked={addressLinkValue.toString() === option.id.toString()}
                        onCheckedChange={() => methods.setValue('is_link', option.id)}
                        className="rounded-full"
                      />
                      <Label htmlFor={option.label}>{option.label}</Label>
                    </div>
                  ))}
                </div>

                {addressLinkValue === 1 && (
                  <div className="space-y-4">
                    <Label>{t('common.locationLink')}</Label>
                    <div className="relative">
                      <FormInput
                        icon="map-pin"
                        placeholder={t('common.enter') + ' ' + t('common.locationLink')}
                        className="pl-8 rounded-full"
                        name="address_link"
                      />
                    </div>
                  </div>
                )}

                {addressLinkValue === 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {addressFields.slice(0, 2).map((field, idx) => (
                        <div key={idx} className="space-y-2">
                          <Label>{t(`common.${field.label}`)}</Label>
                          <FormInput
                            name={field.name}
                            placeholder={`${t('common.enter')} ${t(`common.${field.placeholder}`)}`}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {addressFields.slice(2).map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label>{t(`common.${field.label}`)}</Label>
                          <FormInput
                            name={field.name}
                            placeholder={`${t('common.enter')} ${t(`common.${field.placeholder}`)}`}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="pt-4 lg:max-w-[200px] ms-auto">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.customer')
                      : t('common.add_new') + ' ' + t('common.customer')
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
