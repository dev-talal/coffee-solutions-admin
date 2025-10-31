import * as z from 'zod';

export const regionSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.region_required') }),
    ar_name: z.string().min(1, { message: t('common.region_required') }),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
  });

export const citySchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.city_name_required') }),
    ar_name: z.string().min(1, { message: t('common.city_name_required') }),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
    region_id: z.string().min(1, t('common.region_required')),
  });

export type CityValues = z.infer<ReturnType<typeof citySchema>>;
export type RegionValues = z.infer<ReturnType<typeof regionSchema>>;
