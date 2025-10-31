import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLogoutMutation } from '@/features/api/auth/authApi';
import { logoutUser } from '@/features/slices/auth/authSlice';
import { useAppDispatch } from '@/store';
import type { User } from '@/common/types/authTypes';
import DialogOption from './Dialogue';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';

interface UserMenuProps {
  user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout(null).unwrap();
    dispatch(logoutUser());
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex items-center gap-2 py-1 px-2 cursor-pointer bg-secondary rounded-full transition"
            onClick={() => setOpen(!open)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={(user?.profile as string) || ''} alt="Profile" />
              <AvatarFallback>
                {user?.first_name?.[0] ?? 'U'}
                {user?.last_name?.[0] ?? ''}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {/* {user?.first_name + ' ' + user?.last_name} */}
              {user?.first_name}
            </span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          className="w-48 p-2 rounded-xl shadow-lg border bg-card z-50 mt-7 font-semibold"
        >
          <div
            onClick={() => {
              navigate('/profile');
              setOpen(false);
            }}
            className="cursor-pointer px-4 py-2 hover:bg-muted rounded text-sm flex items-center gap-2 flex-row"
          >
            <DynamicIcon name="circle-user" className="w-4 h-4" />
            {t('common.profile')}
          </div>
          <div
            onClick={() => {
              setDialogOpen(true);
              setOpen(false);
            }}
            className="cursor-pointer px-4 py-2 hover:bg-muted rounded text-sm text-red-600 flex items-center gap-2 flex-row"
          >
            <DynamicIcon name="log-out" className="w-4 h-4" />
            {t('common.logout')}
          </div>
        </PopoverContent>
      </Popover>

      <DialogOption
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleLogout}
        type="logOut"
        loading={isLoading}
        loadingText={t('common.loggingOut')}
        dialogData={[
          t('logout.confirmMessage'),
          t('logout.cancelButton'),
          t('logout.confirmButton'),
        ]}
      />
    </>
  );
}
