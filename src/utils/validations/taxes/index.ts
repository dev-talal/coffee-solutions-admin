import { z } from 'zod';

export const taxesSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.tax_name_required') }),
    rate: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z.number({ message: t('common.enterRate') }).min(0, { message: t('common.rate_min') }),
    ),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
  });

export type TaxesValues = z.infer<ReturnType<typeof taxesSchema>>;
