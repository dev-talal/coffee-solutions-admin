import * as z from 'zod';
import { isPhoneValid } from '../phone';

export const addressSchema = (t: (key: string) => string) =>
  z.discriminatedUnion('is_link', [
    z.object({
      is_link: z.literal(1),
      address_link: z.string().min(1, t('common.address_link_required')),
    }),
    z.object({
      is_link: z.literal(0),
      short_address: z.string().min(1, t('common.short_address_required')),
      building_number: z.string().min(1, t('common.building_number_required')),
      secondary_number: z.string().min(1, t('common.secondary_number_required')),
      postal_code: z.string().min(1, t('common.postal_code_required')),
      city: z.string().min(1, t('common.city_required')),
      ar_short_address: z.string().min(1, t('common.ar_short_address_required')),
      ar_building_number: z.string().min(1, t('common.ar_building_number_required')),
      ar_secondary_number: z.string().min(1, t('common.ar_secondary_number_required')),
      ar_postal_code: z.string().min(1, t('common.ar_postal_code_required')),
      ar_city: z.string().min(1, t('common.ar_city_required')),
    }),
    z.object({
      is_link: z.literal(2),
    }),
  ]);

export const customerSchema = (t: (key: string) => string) =>
  z
    .intersection(
      z.object({
        id: z.number().optional(),
        first_name: z.string().min(1, { message: t('common.first_name_required') }),
        last_name: z.string().min(1, { message: t('common.last_name_required') }),
        email: z.string().email({ message: t('common.email_required') }),
        phone: z
          .string()
          .refine((data) => isPhoneValid(data), { message: t('common.phone_required') }),
        customer_code: z.string().min(1, { message: t('common.customer_code_required') }),
        registration_number: z
          .string()
          .min(1, { message: t('common.registration_number_required') }),
        vat_number: z.string().min(1, { message: t('common.vat_number_required') }),
        region_id: z.coerce.number().min(1, { message: t('common.region_select_required') }),
        city_id: z.coerce.number().min(1, { message: t('common.city_required') }),
        warehouse_id: z.coerce.number().min(1, { message: t('common.warehouse_required') }),
        customer_category_id: z.coerce
          .number()
          .min(1, { message: t('common.customer_category_required') }),
        customer_care_id: z.string().min(1, { message: t('common.customer_care_required') }),
        sales_id: z.string().min(1, { message: t('common.sales_required') }),
        credit_limit: z.coerce.number().min(0, { message: t('common.credit_limit_required') }),
        password: z.string().optional(),
        company_name: z.string().min(1, { message: t('common.company_name_required') }),
        ar_company_name: z.string().min(1, { message: t('common.company_name_required') }),
        address_id: z.number().optional(),
      }),
      addressSchema(t),
    )
    .refine(
      (data) => {
        return data.id || (data.password && data.password.length >= 6);
      },
      {
        message: t('common.password_required'),
        path: ['password'],
      },
    );

export type DeliveryAddressFormData = z.infer<ReturnType<typeof addressSchema>>;
export type CustomerValues = z.infer<ReturnType<typeof customerSchema>>;
