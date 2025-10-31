import * as z from 'zod';

export const productCategorySchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.category_required') }),
    ar_name: z.string().min(1, { message: t('common.category_required') }),
    icon: z.any().refine((val): val is FileList | string => {
      if (typeof val === 'string') return true;
      if (val instanceof FileList) {
        return val.length > 0 && Array.from(val).every((file) => file.type.startsWith('image/'));
      }
      return false;
    }, 'An image file is required'),
    parent_id: z.string().optional(),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
  });

export type ProductCategoryValues = z.infer<typeof productCategorySchema>;
