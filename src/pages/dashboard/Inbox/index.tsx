import { useEffect, useState, useMemo } from 'react';

import { useTheme } from '@/components/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import InboxUsers from '@/components/dashboard/inbox/InboxUsers';
import ChatBody from '@/components/dashboard/inbox/ChatBody';
import InboxOrderDetail from '@/components/dashboard/inbox/InboxOrderDetail';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useGetRoomsQuery } from '@/features/api/chat/ChatApi';
import { useLocation, useNavigate } from 'react-router';

const InboxPage = () => {
  const { height, width } = useWindowSize();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('rId');

  const { data: chatRooms = [] } = useGetRoomsQuery();

  const isBelow1280 = width < 1280;

  const [showLeftPanel, setShowLeftPanel] = useState(width >= 992);
  const [showRightPanel, setShowRightPanel] = useState(width >= 1280);

  const onSelectUser = (id: number) => {
    navigate(`/inbox?rId=${id}`);
    if (width < 992) setShowLeftPanel(false);
  };

  useEffect(() => {
    setShowLeftPanel(width >= 992);
  }, [width]);

  useEffect(() => {
    setShowRightPanel(width >= 1280);
  }, [width]);

  const selectedRoom = useMemo(() => {
    if (!roomId) return null;

    return chatRooms.find((room) => room.id == roomId);
  }, [chatRooms, roomId]);

  return (
    <div className="relative grid grid-cols-1">
      <Card
        className="flex-1 rounded-3xl overflow-hidden p-0"
        style={{ height: `${height - 157}px` }}
      >
        <CardContent className="p-0 h-full flex relative">
          {(showLeftPanel || width >= 992) && (
            <div
              className={cn(
                'h-full w-[19rem] shrink-0 border-r bg-background z-30 transition-all duration-300 shadow-lg',
                width < 992 ? 'absolute top-0 left-0 shadow-lg' : '',
              )}
            >
              <InboxUsers
                setLeftPanel={setShowLeftPanel}
                onSelectUser={onSelectUser}
                roomId={roomId ?? ''}
              />
            </div>
          )}

          <div className={cn('flex-1 flex flex-col', theme === 'dark' ? 'bg-card' : 'bg-slate-50')}>
            <div className="p-4 flex items-center justify-between gap-4 bg-card border-b">
              <div className="flex items-center gap-4">
                {width < 992 && (
                  <Button variant="ghost" size="icon" onClick={() => setShowLeftPanel(true)}>
                    <DynamicIcon name="menu" className="w-5 h-5" />
                  </Button>
                )}
                {selectedRoom && (
                  <>
                    <Avatar className="size-12 text-center">
                      <AvatarImage src={selectedRoom.user.profile} className="border" />

                      <AvatarFallback>{`${selectedRoom.customer_care_agent.first_name} ${selectedRoom.user.first_name}`}</AvatarFallback>
                    </Avatar>

                    <div>
                      <h5 className="font-semibold text-lg mb-0 leading-5">
                        {selectedRoom.room_name}
                      </h5>
                      <small>Customer</small>
                    </div>
                  </>
                )}
              </div>

              {isBelow1280 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRightPanel((prev) => !prev)}
                >
                  {showRightPanel ? (
                    <DynamicIcon name="x" className="h-5 w-5" />
                  ) : (
                    <DynamicIcon name="package" className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            <ChatBody roomId={roomId ?? ''} />
          </div>

          {(showRightPanel || !isBelow1280) && (
            <div
              className={cn(
                'h-full w-[19rem] shrink-0 border-l bg-background z-30 transition-all duration-300',
                isBelow1280 ? 'absolute top-0 right-0 shadow-lg' : '',
              )}
            >
              <InboxOrderDetail setRightPanel={setShowRightPanel} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InboxPage;
