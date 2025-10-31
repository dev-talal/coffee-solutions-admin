import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef } from 'react';
import { Confetti, type ConfettiRef } from '../magicui/confetti';
import CheckCircle from './CheckCircle';
import { useAppSelector, useAppDispatch } from '@/store';
import { closeResponseDialog } from '@/features/slices/response/responseDialogSlice';
import { Button } from '../ui/button';

const SuccessDialog: React.FC = () => {
  const confettiRef = useRef<ConfettiRef>(null);
  const { open, message } = useAppSelector((state) => state.responseDialog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open && confettiRef.current) {
      confettiRef.current?.fire();
    }
  }, [open, confettiRef]);

  const onOpenChange = () => {
    dispatch(closeResponseDialog());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogContent className="sm:max-w-md bg-card text-center rounded-xl shadow-none py-10 px-6 overflow-hidden">
        <Confetti
          options={{
            particleCount: 300,
          }}
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
        />

        <div className="flex justify-center items-center mb-2 z-10 relative">
          <div className="bg-green-100 rounded-full p-4 animate-scale-in">
            <CheckCircle />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-green-700">Success!</h2>
        <p className="text-lg font-medium  mt-1">{message}</p>
        <Button
          onClick={onOpenChange}
          className="mt-3 px-6 relative z-10 py-2 bg-yellow-400 font-semibold text-black dark:text-white text-base rounded-full hover:bg-yellow-500 transition"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
