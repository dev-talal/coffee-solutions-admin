import { z } from 'zod';
import { isPhoneValid } from '../phone';

export const profileSchema = (t: { (key: string): string }) =>
  z.object({
    first_name: z.string().min(1, { message: t('common.first_name_required') }),
    last_name: z.string().min(1, { message: t('common.last_name_required') }),
    email: z.email({ message: t('common.email_required') }),
    phone: z.string().refine((data) => isPhoneValid(data), { message: t('common.phone_required') }),
    profile: z.any().refine((val): val is FileList | string => {
      if (typeof val === 'string') return true;
      if (val instanceof FileList) {
        return val.length > 0 && Array.from(val).every((file) => file.type.startsWith('image/'));
      }
      return false;
    }, t('common.profile_image_required')),
  });

export type ProfileSchemaType = z.infer<ReturnType<typeof profileSchema>>;
