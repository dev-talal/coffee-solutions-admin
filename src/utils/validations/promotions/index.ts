import * as z from 'zod';

export const promotionSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.promotion_name_required') }),
    ar_name: z.string().min(1, { message: t('common.promotion_name_required') }),
    code: z.string().min(1, { message: t('common.promotion_code_required') }),
    quantity: z.coerce.number().min(0, { message: t('common.promotion_quantity_required') }),
    product_category_id: z.string().min(1, { message: t('common.product_category_required') }),
    price: z.coerce.number().min(1, { message: t('common.product_price_min') }),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
    promotion_end_date: z.date().refine((date) => !!date, {
      message: t('common.date_error'),
    }),
    description: z.string().optional(),
    ar_description: z.string().optional(),
    product_ids: z.array(z.string()).min(1, { message: t('common.promotion_required') }),
    promotion_quantities: z.array(
      z.coerce.number().min(1, { message: t('common.promotion_product_quantity_required') }),
    ),
    images: z
      .array(z.string())
      .refine((arr) => arr.filter((img) => img.trim() !== '').length >= 1, {
        message: t('common.product_image_required'),
      }),
  });

export type PromotionValues = z.infer<ReturnType<typeof promotionSchema>>;
