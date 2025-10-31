import * as z from 'zod';

export const customerCategorySchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.category_required') }),
    discount: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({ message: t('common.discount_required') })
        .min(0, { message: t('common.discount_min') })
        .max(100, { message: t('common.discount_max') }),
    ),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
  });

export type CustomerCategoryValues = z.infer<ReturnType<typeof customerCategorySchema>>;
