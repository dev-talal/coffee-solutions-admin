import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DialogOption from './Dialogue';
import { useLogoutMutation } from '@/features/api/auth/authApi';
import { logoutUser } from '@/features/slices/auth/authSlice';
import { useAppDispatch } from '@/store';
import type { User } from '@/common/types/authTypes';
import { useTranslation } from 'react-i18next';

export default function UserLogout({ user }: { user: User | null }) {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout(null).unwrap();
    dispatch(logoutUser());
  };

  return (
    <>
      <div
        className="flex items-center gap-2 py-1 px-2 cursor-pointer bg-secondary rounded-full  transition"
        onClick={() => setDialogOpen(true)}
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">
          {user?.first_name}&nbsp;{user?.last_name}
        </span>
      </div>

      <DialogOption
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleLogout}
        loading={isLoading}
        dialogData={[
          t('logout.confirmMessage'),
          t('logout.cancelButton'),
          t('logout.confirmButton'),
        ]}
      />
    </>
  );
}
