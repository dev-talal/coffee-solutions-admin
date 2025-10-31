import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ListWithPopoverProps<T> {
  items: T[];
  maxVisible?: number;
  renderItem: (item: T) => React.ReactNode;
  title?: string;
}

export function ListWithPopover<T>({
  items,
  maxVisible = 3,
  renderItem,
  title = 'Remaining Items',
}: ListWithPopoverProps<T>) {
  const [open, setOpen] = useState(false);

  if (items.length <= maxVisible) {
    return <>{items.map((item) => renderItem(item))}</>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const remainingItems = items.slice(maxVisible);
  const remainingCount = remainingItems.length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visibleItems.map((item) => renderItem(item))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full px-3 py-1 text-sm bg-transparent">
            +{remainingCount}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-[200px] p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold">{title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-auto p-1 rounded-full hover:bg-red-50 hover:text-red-600"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {remainingItems.map((item) => renderItem(item))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
