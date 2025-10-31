import { useState, lazy, Suspense, useMemo } from 'react';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useGetRoomsQuery } from '@/features/api/chat/ChatApi';
const HoverableScrollArea = lazy(() => import('@/components/partials/HoverableScrollArea'));

type InboxUsersProps = {
  setLeftPanel: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectUser?: (id: number) => void;
  roomId: string;
};

export default function InboxUsers({ setLeftPanel, onSelectUser, roomId }: InboxUsersProps) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(true);
  const { width } = useWindowSize();
  const { data: chatRooms = [] } = useGetRoomsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleUserClick = (id: number) => {
    if (width < 992) setLeftPanel(false);
    if (onSelectUser) onSelectUser(id);
  };

  const sortedRooms = useMemo(() => {
    if (!chatRooms) return [];
    return [...chatRooms].sort((a, b) => {
      return b.last_message.id - a.last_message.id;
    });
  }, [chatRooms]);

  const filterrooms = useMemo(() => {
    if (showAll) return sortedRooms;
    return sortedRooms.filter((room) => room.unread_messages_count > 0);
  }, [showAll, sortedRooms]);

  return (
    <div className="static h-full" style={{ width: '19rem' }}>
      <SidebarHeader className="bg-card text-card-foreground flex flex-col gap-4 px-4 py-6">
        {width < 992 && (
          <Button
            variant="ghost"
            size="icon"
            className="self-end"
            onClick={() => setLeftPanel(false)}
          >
            <DynamicIcon name="x" className="size-6 text-red-700" />
          </Button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className={cn(
              'rounded-full hover:bg-chart-1',
              showAll ? 'bg-chart-1 text-card-foreground' : 'bg-transparent',
            )}
            onClick={() => setShowAll(true)}
          >
            {t('chat.all')}
          </Button>
          <Button
            variant="outline"
            className={cn(
              'rounded-full hover:bg-chart-1',
              !showAll ? 'bg-chart-1 text-card-foreground' : 'bg-transparent',
            )}
            onClick={() => setShowAll(false)}
          >
            {t('chat.unread')}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card text-card-foreground h-full">
        <Suspense>
          <HoverableScrollArea>
            <SidebarMenu className="px-4">
              {filterrooms.map((data) => (
                <SidebarMenuItem key={`${data.room_name}-${data.id}`} className="cursor-pointer">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'p-4 rounded-[15px] hover:bg-chart-1/6',
                      roomId == data.id ? 'bg-chart-1/6' : '',
                    )}
                    onClick={() => handleUserClick(Number(data.id))}
                  >
                    <a className="h-auto">
                      <div className="flex items-start justify-between gap-4">
                        <Avatar className="size-14">
                          <AvatarImage src={data.user.profile} className="border" />
                          <AvatarFallback>{`${data.customer_care_agent.first_name[0]} ${data.user.first_name[0]}`}</AvatarFallback>
                        </Avatar>
                        <div className="flex gap-3">
                          <div>
                            <h5 className="text-lg font-semibold leading-5">{data?.room_name}</h5>
                            <p className="leading-5 line-clamp-1">{data.last_message?.message}</p>
                          </div>
                          {data.unread_messages_count > 0 && (
                            <Badge className="self-center rounded-full w-6 h-6 bg-chart-1 text-black">
                              {data.unread_messages_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </HoverableScrollArea>
        </Suspense>
      </SidebarContent>
    </div>
  );
}
