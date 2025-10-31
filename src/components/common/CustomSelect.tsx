import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export default function CustomSelect({
  placeholder,
  value,
  onChange,
  options,
  className,
}: CustomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
