import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { DynamicIcon } from 'lucide-react/dynamic';

interface PopupItem {
  title: string;
  message: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

interface ClickPopupProps {
  icon: LucideIcon;
  label: string;
  items: PopupItem[];
  badgeColor?: string;
}

const ClickDropDown: React.FC<ClickPopupProps> = ({
  icon: TriggerIcon,
  label,
  items,
  badgeColor = 'bg-amber-500',
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setOpen(!open)}
          className="w-11 h-11 rounded-full relative cursor-pointer overflow-hidden"
        >
          <TriggerIcon className="size-5" />
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${badgeColor}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="w-[350px] p-0 rounded-xl shadow-lg border bg-card z-50 mt-7"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{label}</h3>
          <button
            onClick={() => setOpen(false)}
            className="ml-2 rounded-full p-1 hover:bg-red-100"
            aria-label="Close"
          >
            <DynamicIcon name="x" className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto divide-y">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 hover:bg-chart-1/5">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor}`}
              >
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm">{item.message}</div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ClickDropDown;
