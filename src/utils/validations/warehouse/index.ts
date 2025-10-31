import { z } from 'zod';

export const warehouseSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.warehouse_name_required') }),
    ar_name: z.string().min(1, { message: t('common.warehouse_name_required') }),
    region_ids: z.array(z.string()).min(1, { message: t('common.region_select_required') }),
    status: z.enum(['0', '1'], { message: t('common.selectStatus') }),
  });

export type WarehouseFormValues = z.infer<ReturnType<typeof warehouseSchema>>;
