import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordValues } from '@/utils/validations/auth';
import { FormInput } from '@/components/forms/context/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@/components/common/LoadingButton';
import { useResetPasswordMutation } from '@/features/api/auth/authApi';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [resetPassword, { isLoading: isLoadingChange }] = useResetPasswordMutation();

  const methods = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (user) {
      methods.reset({
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    }
  }, [user, methods]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword(data).unwrap();
      reset();
    } catch (e) {
      console.error('Password change failed:', e);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 max-h-fit px-4">
      <Card className="max-w-md w-full shadow-md">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">{t('auth.changePassword')}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block mb-1 text-base font-medium">{t('auth.old_password')}</label>
                <FormInput
                  name="old_password"
                  type={'password'}
                  isPassword={true}
                  placeholder={t('auth.enter_old_password')}
                />
              </div>

              <div className="space-y-2">
                <label className="block mb-1 text-base font-medium">{t('auth.new_password')}</label>
                <FormInput
                  name="new_password"
                  type={'password'}
                  isPassword={true}
                  placeholder={t('auth.enter_new_password')}
                />
              </div>

              <div className="space-y-2">
                <label className="block mb-1 text-base font-medium">
                  {t('auth.confirm_password')}
                </label>
                <FormInput
                  name="new_password_confirmation"
                  type={'password'}
                  isPassword={true}
                  placeholder={t('auth.reenter_new_password')}
                />
              </div>

              <div className="flex justify-end mt-6">
                <LoadingButton
                  type="submit"
                  isLoading={isLoadingChange}
                  className="w-full md:w-auto rounded-full bg-yellow-400 text-black hover:bg-yellow-500"
                  label={t('common.update')}
                />
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
