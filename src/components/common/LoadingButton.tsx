import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface Props {
  isLoading: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

export default function LoadingButton({
  isLoading,
  className,
  label,
  disabled = false,
  type = 'submit',
  onClick,
}: Props) {
  return (
    <>
      <Button
        {...(className && {
          className: cn('bg-amber-400 text-black dark:text-white hover:bg-amber-500', className),
        })}
        disabled={isLoading || disabled}
        type={type}
        {...(onClick && { onClick: onClick })}
      >
        {isLoading ? <Loader className="animate-spin size-6" /> : label}
      </Button>
    </>
  );
}
