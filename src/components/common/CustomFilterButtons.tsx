import { useState } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import type { DateRange } from 'react-day-picker';

type ButtonType = 'date' | 'price' | 'export' | 'filter' | 'add' | 'custom';

export type ButtonConfig = {
  onClick?: () => void;
  label?: string;
  icon?: React.ReactNode;
  show?: boolean;
  buttonType?: ButtonType;
  value?: Date | undefined;
  onDateChange?: (range: { from: Date; to?: Date } | undefined) => void;
  priceRange?: { min?: number; max?: number };
  onPriceChange?: (range: { min?: number; max?: number }) => void;
};

function DateFilterButton({ label, icon, onDateChange }: ButtonConfig) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="hover:bg-muted bg-card rounded-full h-[40px] font-medium text-sm sm:text-[16px] px-4 drop-shadow-sm cursor-pointer"
        >
          {label || 'Date Filter'}
          {icon || <DynamicIcon name="calendar" className="w-4 h-4 ml-2" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto p-2 bg-card border rounded-md shadow-md"
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={(val) => {
            setRange(val);
            if (val?.from && val?.to) {
              onDateChange?.({ from: val.from, to: val.to });
            }
          }}
          captionLayout="dropdown"
          disabled={{
            before: new Date('2020-01-01'),
            after: new Date(),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function PriceFilterButton({ label, icon, priceRange, onPriceChange }: ButtonConfig) {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState<number | undefined>(priceRange?.min);
  const [max, setMax] = useState<number | undefined>(priceRange?.max);

  const applyFilter = () => {
    onPriceChange?.({ min, max });
    setOpen(false);
  };

  const clearFilter = () => {
    setMin(undefined);
    setMax(undefined);
    onPriceChange?.({ min: undefined, max: undefined });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="hover:bg-muted bg-card rounded-full h-[40px] font-medium text-sm sm:text-[16px] px-4 drop-shadow-sm cursor-pointer"
        >
          {label || 'Price Filter'}
          {icon || <DynamicIcon name="dollar-sign" className="w-4 h-4 ml-2" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-64 p-4 bg-card border rounded-md shadow-md"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Min Price</label>
          <input
            type="number"
            value={min ?? ''}
            onChange={(e) => setMin(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Minimum"
            className="border rounded px-2 py-1 text-sm"
          />

          <label className="text-sm font-medium">Max Price</label>
          <input
            type="number"
            value={max ?? ''}
            onChange={(e) => setMax(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Maximum"
            className="border rounded px-2 py-1 text-sm"
          />

          <div className="flex justify-between mt-2">
            <Button variant="ghost" onClick={clearFilter} className="text-sm text-gray-500">
              Clear
            </Button>
            <Button variant="default" onClick={applyFilter} className="text-sm">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const RenderButton = (button?: ButtonConfig) => {
  if (!button?.show) return null;

  const { buttonType, onClick, label, icon } = button;

  switch (buttonType) {
    case 'add':
      return (
        <Button
          onClick={onClick}
          className="bg-amber-400 hover:bg-amber-500 dark:text-white text-black rounded-full h-[40px] font-medium text-sm sm:text-[16px] gap-2 px-4 drop-shadow-sm cursor-pointer"
        >
          {label || 'Add New'}
          {icon || <DynamicIcon name="plus" className="w-4 h-4" />}
        </Button>
      );

    case 'date':
      return <DateFilterButton {...button} />;

    case 'price':
      return <PriceFilterButton {...button} />;

    case 'export':
      return (
        <Button
          variant="outline"
          onClick={onClick}
          className="hover:bg-muted bg-card rounded-full h-[40px] font-medium text-sm sm:text-[16px] px-4 drop-shadow-sm cursor-pointer"
        >
          {label || 'Export'}
          {icon || <DynamicIcon name="download" className="w-4 h-4 ml-2" />}
        </Button>
      );

    default:
      return (
        <Button
          variant="outline"
          onClick={onClick}
          className="hover:bg-muted bg-card rounded-full h-[40px] font-medium text-sm sm:text-[16px] px-4 drop-shadow-sm cursor-pointer"
        >
          {label || 'Filter'}
          {icon || <DynamicIcon name="list-filter" className="w-4 h-4 ml-2" />}
        </Button>
      );
  }
};

export default RenderButton;
