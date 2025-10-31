import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Controller, useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
}

export const FormOTPInput: React.FC<FormInputProps> = (props) => {
  const { name } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputOTP
            maxLength={6}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-[50px] w-16 text-lg font-semibold" />
              <InputOTPSlot index={1} className="h-[50px] w-16 text-lg font-semibold" />
              <InputOTPSlot index={2} className="h-[50px] w-16 text-lg font-semibold" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className="h-[50px] w-16 text-lg font-semibold fous:shadow-none"
              />
              <InputOTPSlot index={4} className="h-[50px] w-16 text-lg font-semibold" />
              <InputOTPSlot index={5} className="h-[50px] w-16 text-lg font-semibold" />
            </InputOTPGroup>
          </InputOTP>
        )}
      />
      {error && <span className="text-red-500 mt-2 block">{error}</span>}
    </>
  );
};
