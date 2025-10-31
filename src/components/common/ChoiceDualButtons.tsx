import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LoadingButton from './LoadingButton';

interface TwoButtonProps {
  buttonData: [string, string];
  onCancel: () => void;
  onConfirm?: () => void;
  className?: string;
  justify?: 'center' | 'between' | 'start' | 'end';
  confirmType?: 'button' | 'submit';
  loading?: boolean;
}

const TwoButton: React.FC<TwoButtonProps> = ({
  buttonData,
  onCancel,
  onConfirm,
  justify = 'center',
  className = '',
  confirmType = 'button',
  loading = false,
}) => {
  const [confirmText, cancelText] = buttonData;

  return (
    <div
      className={cn(
        `flex flex-col w-full gap-2 my-4 md:my-2 sm:flex-col  md:items-center lg:flex-row justify-${justify}`,
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        className="rounded-full border cursor-pointer  lg:h-[48px] lg:w-[151px] md:h-[40px] md:w-full text-black font-semibold lg:text-lg bg-card dark:bg-white"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </Button>

      <LoadingButton
        type={confirmType}
        label={confirmText}
        isLoading={loading}
        className="rounded-full cursor-pointer lg:h-[48px] lg:w-[151px] md:h-[40px] md:w-full  text-foreground font-semibold lg:text-lg"
        {...(confirmType === 'button' && onConfirm && { onClick: onConfirm })}
      />
    </div>
  );
};

export default TwoButton;
