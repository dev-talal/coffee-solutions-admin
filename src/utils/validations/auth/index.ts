import * as z from 'zod';

export const loginSchema = (t: { (key: string): string }) =>
  z.object({
    email: z.email({ message: t('common.email_required') }),
    password: z.string().min(8, { message: t('common.password_required') }),
  });

export const emailSchema = (t: { (key: string): string }) =>
  z.object({
    email: z.email({ message: t('common.email_required') }),
  });

export const forgotPasswordSchema = (t: { (key: string): string }) =>
  z
    .object({
      email: z.email({ message: t('common.email_required') }),
      otp: z
        .string({ message: t('common.otp_required') })
        .min(6, { message: t('common.otp_min') })
        .default(''),
      password: z.string().min(8, { message: t('common.password_required') }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t('common.password_mismatch'),
      path: ['password_confirmation'],
    });

export const resetPasswordSchema = (t: { (key: string): string }) =>
  z
    .object({
      old_password: z.string().min(8, { message: t('common.password_required') }),
      new_password: z.string().min(8, { message: t('common.new_password_required') }),
      new_password_confirmation: z.string({ message: t('common.confirm_password_required') }),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: t('common.password_mismatch'),
      path: ['new_password_confirmation'],
    });

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>;
export type EmailValues = z.infer<ReturnType<typeof emailSchema>>;
export type ForgotPasswordValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;
export type ResetPasswordValues = z.infer<ReturnType<typeof resetPasswordSchema>>;
