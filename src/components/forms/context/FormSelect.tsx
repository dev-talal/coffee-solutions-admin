import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { DynamicIcon } from 'lucide-react/dynamic';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  options: Option[];
  id?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  placeholder = 'Select option(s)',
  className,
  options,
  id,
  disabled = false,
  multiple = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const isRtl = typeof document !== 'undefined' && document.dir === 'rtl';

  return (
    <div className="space-y-2 w-full">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (multiple) {
            const selectedValues: string[] = field.value || [];

            const toggleValue = (val: string) => {
              const newValue = selectedValues.includes(val)
                ? selectedValues.filter((v) => v !== val)
                : [...selectedValues, val];
              field.onChange(newValue);
            };

            const selectedLabels = options
              .filter((opt) => selectedValues.includes(opt.value))
              .map((opt) => opt.label)
              .join(', ');

            return (
              <Popover>
                <PopoverTrigger
                  className={cn(
                    'border rounded px-3 py-2 w-full flex justify-between items-center',
                    isRtl && 'flex-row-reverse text-right',
                    className,
                    error && 'border-red-500',
                    disabled && 'opacity-50 cursor-not-allowed',
                  )}
                  id={id}
                  disabled={disabled}
                >
                  <span className={cn('truncate w-full', isRtl ? 'text-right' : 'text-left')}>
                    {selectedLabels || placeholder}
                  </span>
                  <DynamicIcon name="chevron-down" className="w-4 h-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto min-w-[250px] max-h-64 overflow-auto"
                  align={isRtl ? 'end' : 'start'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        'flex items-center space-x-2 py-1',
                        isRtl && 'flex-row-reverse space-x-reverse',
                      )}
                    >
                      <Checkbox
                        id={`${name}-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={() => toggleValue(option.value)}
                        disabled={disabled}
                      />
                      <label htmlFor={`${name}-${option.value}`} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <SelectTrigger
                id={id}
                className={cn(
                  'px-3 py-2 border rounded w-full',
                  isRtl && 'flex-row-reverse text-right',
                  className,
                  error && 'border-red-500',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <SelectValue
                  placeholder={placeholder}
                  className={cn('truncate w-full', isRtl ? 'text-right' : 'text-left')}
                />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                align={isRtl ? 'end' : 'start'}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={cn(isRtl ? 'text-right' : 'text-left')}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
