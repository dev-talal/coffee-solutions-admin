import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FormInput } from '../forms/context/FormInput';
import { FormFile } from '../forms/context/FormFile';
import { FormPhoneInput } from '../forms/context/FormPhoneInput';
import { profileSchema, type ProfileSchemaType } from '@/utils/validations/auth/profile';
import { cn } from '@/lib/utils';
import LoadingButton from '../common/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarText } from '@/helpers/dataFormat';
import { useEditProfileMutation, useCheckAuthQuery } from '@/features/api/auth/authApi';

export default function ProfileForm() {
  const [editProfile, { isLoading: isLoadingEdit }] = useEditProfileMutation();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { user } = useAuth();

  const [preview, setPreview] = useState<string | null>(null);

  const methods = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema(t)),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      profile: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const confirmText = `${t('common.save')} ${t('common.changes')}`;

  const { refetch } = useCheckAuthQuery(null, { skip: true });

  const onConfirm = async (data: ProfileSchemaType) => {
    let payload = data;

    if (data.profile instanceof FileList && data.profile.length > 0) {
      payload = { ...payload, profile: data.profile[0] };
    } else {
      payload = { ...payload };
      delete payload.profile;
    }

    await editProfile(payload).unwrap();
    await refetch();
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'profile' && value.profile instanceof FileList && value.profile.length > 0) {
        setPreview(URL.createObjectURL(value.profile[0]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user?.phone || ('' as string),
        email: user.email,
        profile: user.profile,
      });
      setPreview(null);
    }
  }, [user, reset]);

  return (
    <div className="grid grid-cols-1 dark:text-white">
      <div className="bg-gradient-to-b from-coffee-brown to-transparent h-42 w-full" />

      <div className="space-y-1">
        <div className="flex flex-col items-center text-center mt-[-70px] lg:flex-row lg:items-center lg:text-left lg:mx-8">
          <div className="overflow-hidden p-1">
            <Avatar className="w-28 h-28 rounded-full bg-card text-xl font-semibold">
              <AvatarImage src={preview || (user?.profile as string)} alt="" />
              <AvatarFallback>
                {getAvatarText(user?.first_name + ' ' + user?.last_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className={cn('my-4 lg:my-0', isRTL ? 'pr-4' : '', 'lg:ml-4')}>
            <h3 className={cn('text-xl font-semibold', isRTL ? 'text-right' : 'text-left')}>
              {user?.first_name + ' ' + user?.last_name}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:flex lg:justify-between lg:items-start">
          <div className="w-full lg:w-[20%] p-4 grid grid-cols-1 gap-2">
            <h2 className="font-semibold">{t('common.personalInfo')}</h2>
            <p className="text-sm text-gray-500">{t('common.descPersonalInfo')}</p>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onConfirm)}
              className="p-4 lg:mx-auto h-auto w-full lg:w-[80%] space-y-4"
            >
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block mb-1 text-base font-medium">
                      {t('common.first_name')}
                    </label>
                    <FormInput
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder={t('common.first_name')}
                      icon="user"
                      iconAlign="left"
                      className="rounded-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block mb-1 text-base font-medium">
                      {t('common.last_name')}
                    </label>
                    <FormInput
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder={t('common.last_name')}
                      icon="user"
                      iconAlign="left"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block mb-1 text-base font-medium">
                    {t('common.phoneNumber')}
                  </label>
                  <FormPhoneInput name="phone" />
                </div>

                <div className="space-y-2">
                  <label className="block mb-1 text-base font-medium">{t('common.email')}</label>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    icon="mail"
                    readOnly
                    iconAlign="left"
                    className="rounded-full"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block mb-1 text-base font-medium">
                    {t('common.profile') + ' ' + t('common.image')}
                  </label>
                  <FormFile name="profile" className="mt-4" />
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-11 md:flex-row md:justify-end">
                <LoadingButton
                  type="submit"
                  isLoading={isLoadingEdit}
                  className="w-full md:w-auto rounded-full bg-yellow-400 text-black hover:bg-yellow-500"
                  label={confirmText}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
