import * as z from 'zod';

export const productSchema = (t: { (key: string): string }) =>
  z
    .object({
      name: z.string().min(1, { message: t('common.product_name_required') }),
      ar_name: z.string().min(1, { message: t('common.product_name_required') }),
      code: z.string().min(1, { message: t('common.product_code_required') }),
      quantity: z.coerce.number().min(0, { message: t('common.product_quantity_required') }),
      product_category_id: z.string().min(1, { message: t('common.product_category_required') }),
      product_unit_id: z.string().min(1, { message: t('common.product_unit_required') }),
      price: z.coerce.number().min(1, { message: t('common.product_price_min') }),
      status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
      pieces_per_box: z.string().optional(),
      is_uom_small: z.enum(['0', '1']),
      uom_product_unit_id: z.coerce.number().optional(),
      description: z.string().min(1, { message: t('common.product_description_required') }),
      ar_description: z.string().min(1, { message: t('common.product_description_required') }),
      images: z
        .array(z.string())
        .refine((arr) => arr.filter((img) => img.trim() !== '').length >= 1, {
          message: t('common.product_image_required'),
        }),
    })
    .refine(
      (data) => {
        if (data.is_uom_small === '1') {
          if (!data.pieces_per_box || !/^\d+$/.test(data.pieces_per_box)) {
            return false;
          }
          if (Number(data.pieces_per_box) > Number(data.quantity)) {
            return false;
          }
        }
        return true;
      },
      {
        message: t('common.cannot_exceed_quantity'),
        path: ['pieces_per_box'],
      },
    )
    .refine(
      (data) => {
        if (
          data.is_uom_small === '1' &&
          (!data.uom_product_unit_id || data.uom_product_unit_id <= 0)
        ) {
          return false;
        }
        return true;
      },
      {
        message: t('common.uom_product_unit_required'),
        path: ['uom_product_unit_id'],
      },
    );

export const productUnitSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.unit_name_required') }),
    ar_name: z.string().min(1, { message: t('common.unit_arabic_name_required') }),
  });

export type ProductUnitValues = z.infer<ReturnType<typeof productUnitSchema>>;
export type ProductValues = z.infer<ReturnType<typeof productSchema>>;
