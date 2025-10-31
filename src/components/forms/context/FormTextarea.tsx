import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = (props) => {
  const { name, label, placeholder, className, ...rest } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(className, error && 'border-red-500')}
        {...register(name)}
        {...rest}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
