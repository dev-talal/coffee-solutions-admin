import { useFormContext, Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FormPhoneInputProps {
  name?: string;
  label?: string;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name = 'phone',
  defaultCountry = 'sa',
  placeholder,
  className,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            defaultCountry={defaultCountry}
            placeholder={placeholder}
            className={cn(
              'relative w-full ',
              'rounded-full border bg-transparent px-3',
              'text-base md:text-sm transition-[color,box-shadow] outline-none',
              'dark:bg-input/30 border-input shadow-xs',
              'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
              'file:text-foreground selection:bg-primary selection:text-primary-foreground',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-400',
              className,
            )}
            inputClassName={cn(
              'w-full bg-transparent border-none outline-none text-sm h-9 text-black dark:text-white',
              isRTL ? 'text-right mx-3' : 'text-left pl-3',
              'dark:text-white text-black',
            )}
            countrySelectorStyleProps={{
              className: cn('border-none'),
              style: {
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
              },
            }}
          />
        )}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
