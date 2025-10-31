import * as z from 'zod';

export const roleSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, { message: t('common.role_name_required') }),
    description: z.string().optional(),
    permissions: z.array(z.string()).min(1, { message: t('common.select_permission_required') }),
  });

export type RoleValues = z.infer<ReturnType<typeof roleSchema>>;
