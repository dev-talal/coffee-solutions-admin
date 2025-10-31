import { z } from 'zod';

export const driverSchema = (t: (key: string) => string) =>
  z.object({
    first_name: z.string().min(1, t('common.first_name_required')),
    last_name: z.string().min(1, t('common.last_name_required')),
    mobile_no: z.string().min(1, t('common.phone_required')),
    status: z.string(),
    warehouse_ids: z.array(z.string()).min(1, t('common.select_warehouse_required')),
  });

export type DriverFormValues = z.infer<ReturnType<typeof driverSchema>>;
