import * as z from 'zod';
import { isPhoneValid } from '../phone';

export const staffSchema = (t: { (key: string): string }) =>
  z
    .object({
      id: z.number().optional(),
      email: z.email({ message: t('common.email_required') }),
      phone: z
        .string()
        .refine((data) => isPhoneValid(data), { message: t('common.phone_required') }),
      first_name: z.string().min(1, { message: t('common.first_name_required') }),
      last_name: z.string().min(1, { message: t('common.last_name_required') }),
      role: z.string().min(1, { message: t('common.role_required') }),
      password: z.string().optional(),
      location: z.string().min(1, { message: t('common.location_required') }),
      employe_number: z.string().min(1, { message: t('common.employee_number_required') }),
      warehouse_ids: z
        .array(z.string().min(1))
        .min(1, { message: t('common.warehouse_required_min') }),
    })
    .refine(
      (data) => {
        return data.id || (data.password && data.password.length >= 6);
      },
      {
        message: t('common.password_required'),
        path: ['password'],
      },
    );

export type StaffValues = z.infer<ReturnType<typeof staffSchema>>;
