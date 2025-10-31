import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { images } from '@/assets';
import { FormInput } from '@/components/forms/context/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emailSchema,
  forgotPasswordSchema,
  type ForgotPasswordValues,
  type EmailValues,
} from '@/utils/validations/auth';
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
  type ResetPasswordValuesModified,
} from '@/features/api/auth/authApi';
import LoadingButton from '@/components/common/LoadingButton';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '@/components/partials/LanguageToggleButton';
import { FormOTPInput } from '@/components/forms/context/FormOtpInput';
import { Label } from '@/components/ui/label';
const ForgetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [forgetPassword, { isLoading: isForgetPasswordLoading }] = useForgetPasswordMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();
  const methods = useForm({
    resolver: zodResolver(!isEmailVerified ? emailSchema(t) : forgotPasswordSchema(t)),
  });

  const onSubmit = async (data: EmailValues | ForgotPasswordValues) => {
    if (!isEmailVerified) {
      await forgetPassword({
        email: data.email,
      }).unwrap();
      setIsEmailVerified(true);
    } else {
      await resetPassword(data as ResetPasswordValuesModified).unwrap();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-accent">
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen justify-between">
        <div className="absolute w-[inherit] flex items-center justify-between p-2">
          <img
            src={images.mianLogo}
            alt="Coffee Solutions"
            className="mt-4 ml-4 w-auto h-[60px]  md:h-[72px] md:w-[120px] lg:w-[150px] lg:h-[100px] md:ml-[7%] lg:ml-[4%] xl:ml-[3%] object-contain"
          />
          <LanguageToggleButton className="bg-transparent text-coffee-brown dark:text-white border-2 mx-4" />
        </div>
        <div className="flex-1 flex items-center justify-center md:pt-20 px-4 sm:px-8 pb-12 lg:pb-0">
          <FormProvider {...methods}>
            <div className="w-full max-w-md space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('login.forgotPassword')}
              </h1>

              <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
                <FormInput
                  name="email"
                  type="email"
                  placeholder={t('login.email')}
                  className=" h-[50px] px-[20px] rounded-full bg-background font-semibold"
                  disabled={isEmailVerified}
                />
                {isEmailVerified && (
                  <div>
                    <FormInput
                      name="password"
                      type={'password'}
                      placeholder={t('login.password')}
                      className="h-[50px] px-[20px] rounded-full bg-background font-semibold"
                      isPassword={true}
                    />
                    <div className="mt-5">
                      <FormInput
                        name="password_confirmation"
                        type={'password'}
                        placeholder={t('common.confirm_password')}
                        className="h-[50px] px-[20px] rounded-full bg-background font-semibold"
                        isPassword={true}
                      />
                    </div>
                    <div className="mt-5">
                      <Label className="mb-3 text-lg">{t('common.enterOneTimeOtp')}</Label>
                      <FormOTPInput name="otp" />
                    </div>
                  </div>
                )}

                <LoadingButton
                  label={t('common.reset')}
                  isLoading={isForgetPasswordLoading || isResetPasswordLoading}
                  className="cursor-pointer w-full h-[50px] mt-4 bg-chart-2 text-white  font-semibold hover:bg-chart-1 text-[16px] rounded-full"
                />
                <div className="flex items-center justify-center">
                  <Link to="/login" className="text-sm text-chart-1 hover:underline font-semibold">
                    {t('common.backToLogin')}
                  </Link>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </div>

      <div className="hidden lg:flex md:w-1/2 min-h-screen relative bg-coffee-brown text-white px-8 py-12 flex-col justify-center items-center">
        <div className="w-full max-w-xl h-fit">
          <div className="relative w-full">
            <img
              src={images.bannerMain}
              alt="Main"
              className="z-30 relative w-full h-full object-contain"
            />
            <img
              src={images.bannerRight}
              alt="right"
              className="w-[127px] object-contain absolute right-0 top-0"
            />
            <img
              src={images.bannerLeft}
              alt="left"
              className="w-[40px] object-contain absolute left-[-40px] top-[50px]"
            />
          </div>

          <img
            src={images.bannerBottom}
            alt="Bottom Line"
            className="object-contain h-[13px] my-10 mx-auto"
          />
        </div>

        <div className="text-center mt-6 max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{t('login.sideTitle')}</h1>
          <p className="text-base md:text-sm leading-relaxed text-gray-200">
            {t('login.sideDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
