import React from 'react';
import { Link } from 'react-router';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { images } from '@/assets';
import { FormInput } from '@/components/forms/context/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginValues } from '@/utils/validations/auth';
import { setUser } from '@/features/slices/auth/authSlice';
import { useAppDispatch } from '@/store';
import { useLoginMutation } from '@/features/api/auth/authApi';
import LoadingButton from '@/components/common/LoadingButton';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '@/components/partials/LanguageToggleButton';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const methods = useForm({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: LoginValues) => {
    const res = await login({
      email: data.email,
      password: data.password,
    }).unwrap();
    dispatch(
      setUser({
        ...res.data.user,
        token: res.data.access_token,
        expires: res.data.expiry_at,
      }),
    );
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
                {t('login.formHeader')}
              </h1>

              <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
                <FormInput
                  name="email"
                  type="email"
                  placeholder={t('login.email')}
                  className=" h-[50px] px-[20px] rounded-full bg-background font-semibold"
                />
                <div>
                  <FormInput
                    name="password"
                    type={'password'}
                    isPassword={true}
                    placeholder={t('login.password')}
                    className="h-[50px] px-[20px] rounded-full bg-background font-semibold"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      className="rounded-full dark:data-[state=checked]:bg-amber-400 "
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      {t('login.remember')}
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-chart-1 hover:underline font-semibold"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <LoadingButton
                  label={t('login.loginButton')}
                  isLoading={isLoading}
                  className="cursor-pointer w-full h-[50px] mt-4 bg-chart-2 text-white  font-semibold hover:bg-chart-1 text-[16px] rounded-full"
                />
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

export default LoginPage;
