import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { getValueByPath } from '@/helpers/dataFormat';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
  isPassword?: boolean;
  readOnly?: boolean;
  icon?: IconName;
  iconAlign?: 'left' | 'right';
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  const {
    name,
    label,
    placeholder,
    type,
    className,
    isPassword = false,
    icon,
    iconAlign = 'left',
    disabled = false,
    ...rest
  } = props;
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = (getValueByPath(errors, name) as { message?: string })?.message;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative">
        <Input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(className, error && 'border-red-500', {
            'pl-10':
              (!isRTL && icon && iconAlign === 'left') || (isRTL && icon && iconAlign === 'right'),
            'pr-10':
              (!isRTL && icon && iconAlign === 'right') || (isRTL && icon && iconAlign === 'left'),
          })}
          {...register(name)}
          {...rest}
          autoComplete="off"
          disabled={disabled}
        />

        {icon && (
          <DynamicIcon
            name={icon}
            className={cn(
              'h-4 w-4 absolute top-1/2 transform -translate-y-1/2',
              isRTL ? 'right-[15px]' : iconAlign === 'left' ? 'left-[15px]' : 'right-[15px]',
            )}
          />
        )}

        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-0 h-full bg-transparent hover:bg-transparent ${
              isRTL ? 'left-2' : 'right-2'
            }`}
          >
            {!showPassword ? (
              <DynamicIcon name="eye" className="h-4 w-4 text-muted-foreground" />
            ) : (
              <DynamicIcon name="eye-off" className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
