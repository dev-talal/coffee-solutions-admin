import { z } from 'zod';

export const bannerSchema = (t: (key: string) => string) =>
  z
    .object({
      url: z.string().min(1, t('common.banner_image_required')),
      type: z.string().min(1, t('common.type_required')),
      category_id: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.type === 'category') {
          return !!data.category_id && data.category_id.trim() !== '';
        }
        return true;
      },
      {
        message: t('common.category_required'),
        path: ['category_id'],
      },
    );

export type BannerFormValues = z.infer<ReturnType<typeof bannerSchema>>;
