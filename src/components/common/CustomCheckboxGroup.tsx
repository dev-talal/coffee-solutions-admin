import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface Props {
  option: Option;
  selected: string[];
  onChange: (selected: string[]) => void;
  single?: boolean;
  className?: string;
}

export default function CustomCheckboxGroup({
  option,
  selected,
  onChange,
  single = false,
  className,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<string[]>(selected);

  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  const handleChange = (value: string) => {
    let updated: string[];
    if (single) {
      updated = [value];
    } else {
      if (internalSelected.includes(value)) {
        updated = internalSelected.filter((v) => v !== value);
      } else {
        updated = [...internalSelected, value];
      }
    }

    setInternalSelected(updated);
    onChange(updated);
  };

  return (
    <div className={cn(className)}>
      <label className="flex items-center space-x-2 cursor-pointer">
        <Checkbox
          className="rounded-full"
          checked={internalSelected.includes(option.value)}
          onCheckedChange={() => handleChange(option.value)}
        />
        <span>{option.label}</span>
      </label>
    </div>
  );
}
