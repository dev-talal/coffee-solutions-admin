import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { getValueByPath } from '@/helpers/dataFormat';
import { t } from 'i18next';
import { DynamicIcon } from 'lucide-react/dynamic';

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  iconAlign?: 'left' | 'right';
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [open, setOpen] = React.useState(false);

  const {
    formState: { errors },
  } = useFormContext();

  const error = (getValueByPath(errors, name) as { message?: string })?.message;

  function formatDate(date: Date | undefined) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function parseDateString(dateStr: string): Date | undefined {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date : undefined;
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative flex gap-2">
        <Input
          id={name}
          value={value ? formatDate(value) : ''}
          placeholder={placeholder || 'Select Date'}
          className={cn(className, error && 'border-red-500')}
          onChange={(e) => {
            const newDate = parseDateString(e.target.value);
            onChange(newDate);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={!!error}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={`absolute top-1/2 ${isRTL ? 'left-2' : 'right-2'} -translate-y-1/2`}
            >
              <DynamicIcon name="calendar" className="h-4 w-4" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={(selectedDate) => {
                onChange(selectedDate);
                setOpen(false);
              }}
              disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <span className="text-red-500 text-sm">{t('common.date_error')}</span>}
    </div>
  );
};
