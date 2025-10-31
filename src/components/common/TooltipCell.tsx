import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipCell = ({ value }: { value: string }) => {
  const display = value || 'N/A';
  const showTooltip = display.length > 1;

  return showTooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <p className="text-sm truncate cursor-pointer">{display}</p>
      </TooltipTrigger>
      <TooltipContent>
        <p>{display}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <span className="text-sm truncate">{display}</span>
  );
};

export default TooltipCell;
