import { useSidebar } from '@/components/ui/sidebar';
import { Bell, MessageCircle } from 'lucide-react';
import ClickDropDown from '@/components/dashboard/DashHeaderDropDown';
import DashboardProfileDropdown from '@/components/dashboard/dashboardProfileDropdown';
import ThemeToggleButton from './ThemeToggleButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import LanguageToggleButton from './LanguageToggleButton';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useGetRoomsQuery } from '@/features/api/chat/ChatApi';
import { useMemo } from 'react';

const DashboardHeader = () => {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  const { data: rooms = [] } = useGetRoomsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const newMessageCount = useMemo(() => {
    return rooms.some((room) => room.unread_messages_count > 0);
  }, [rooms]);

  const notifications = [
    {
      title: t('dashboardHeader.orderReceivedTitle'),
      message: t('dashboardHeader.orderReceivedMessage'),
      icon: Bell,
      iconColor: 'text-chart-5',
      bgColor: 'bg-amber-100',
    },
    {
      title: t('dashboardHeader.paymentTitle'),
      message: t('dashboardHeader.paymentMessage'),
      icon: Bell,
      iconColor: 'text-chart-5',
      bgColor: 'bg-amber-100',
    },
    {
      title: t('dashboardHeader.complaintTitle'),
      message: t('dashboardHeader.complaintMessage'),
      icon: Bell,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card shadow-sm w-full h-[93px] relative z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => toggleSidebar()}
          className="w-11 h-11 rounded-full relative cursor-pointer overflow-hidden"
        >
          <DynamicIcon name="align-justify" className="size-5 rounded-full" />
        </Button>
        <div className="lg:block hidden">
          <h2 className="text-2xl font-bold">
            {t('dashboardHeader.greeting', {
              first_name: user?.first_name ?? '',
              last_name: user?.last_name ?? '',
            })}
          </h2>
          <p className="text-sm">{t('dashboardHeader.welcome')}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          variant="secondary"
          type="button"
          className="w-11 h-11 rounded-full relative cursor-pointer overflow-hidden"
        >
          <MessageCircle className="size-5" />
          {newMessageCount && (
            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500`} />
          )}
        </Button>
        {!isMobile && (
          <>
            <ClickDropDown
              icon={Bell}
              label={t('dashboardHeader.notifications')}
              items={notifications}
            />
          </>
        )}
        <LanguageToggleButton />
        <ThemeToggleButton />
        <DashboardProfileDropdown user={user} />
      </div>
    </header>
  );
};

export default DashboardHeader;
