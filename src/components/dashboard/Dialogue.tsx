import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import TwoButton from '@/components/common/ChoiceDualButtons';
import { DynamicIcon } from 'lucide-react/dynamic';

interface DialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onConfirm: () => void;
  loadingText?: string;
  loading?: boolean;
  dialogData: [string, string, string];
  type?: 'logOut' | 'Delete';
}

const DialogOption: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  dialogData,
  loading = false,
  loadingText = '',
  type = 'Delete',
}) => {
  const [dialogTitle, cancelText, confirmText] = dialogData;

  const renderIcon = () => {
    const baseClasses = 'w-12 h-12 mb-4 md:w-14 md:h-14';
    switch (type) {
      case 'Delete':
        return <DynamicIcon name="octagon-alert" className={`${baseClasses} text-red-500`} />;
      case 'logOut':
        return <DynamicIcon name="user" className={`${baseClasses} text-black dark:text-white`} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <div className="flex justify-center mt-8">{renderIcon()}</div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center justify-center">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {loading ? (
            <div className="w-full flex flex-col items-center text-center mt-4">
              <DynamicIcon name="loader" className="animate-spin text-chart-1" size={36} />
              <span className="text-[12px] text-muted-foreground">{loadingText}</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full mt-6">
              <TwoButton
                buttonData={[confirmText, cancelText]}
                onCancel={() => onOpenChange(false)}
                onConfirm={onConfirm}
                confirmType="button"
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogOption;
