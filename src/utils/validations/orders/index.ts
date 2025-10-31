import * as z from 'zod';

export const transferOrderSchema = (t: { (key: string): string }) =>
  z.object({
    transfer_to: z.string().min(1, { message: t('common.select_warehouse_required') }),
  });

export type TransferOrderValues = z.infer<ReturnType<typeof transferOrderSchema>>;

export const dispatchOrderSchema = (t: (key: string) => string) =>
  z.object({
    driver_id: z.string().min(1, t('common.driver_required')),
  });

export type DispatchOrderValues = z.infer<ReturnType<typeof dispatchOrderSchema>>;
