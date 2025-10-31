import { lazy, useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatApi, useLazyGetRoomMessagesQuery } from '@/features/api/chat/ChatApi';
import type { MessageType } from '@/common/types/chatTypes';
import { DynamicIcon } from 'lucide-react/dynamic';
import ChatFooter from '@/components/dashboard/inbox/ChatFooter';
import { useAppDispatch } from '@/store';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { cn } from '@/lib/utils';

const Lightbox = lazy(() => import('yet-another-react-lightbox'));

const ChatBody = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [slides, setSlides] = useState<{ src: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { user } = useAuth();

  const [getRoomMessages, { isFetching }] = useLazyGetRoomMessagesQuery();

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const ScrollBottomOnMessage = () => {
    if (
      chatBodyRef.current &&
      chatBodyRef.current.scrollTop + chatBodyRef.current.clientHeight >=
        chatBodyRef.current.scrollHeight - 5
    ) {
      scrollToBottom();
    }
  };

  const updateRoomCount = useCallback(() => {
    if (
      chatBodyRef.current &&
      chatBodyRef.current.scrollTop + chatBodyRef.current.clientHeight >=
        chatBodyRef.current.scrollHeight - 5
    ) {
      dispatch(
        ChatApi.util.updateQueryData('getRooms', undefined, (rooms) => {
          if (!rooms) return;
          const room = rooms.find((r) => r.id == roomId);

          if (room) {
            room.unread_messages_count = 0;
          }
        }),
      );
    }
  }, [roomId, chatBodyRef]);

  useEffect(() => {
    if (!roomId) return;

    setMessages([]);
    setPage(1);

    setHasMore(true);

    fetchMessages(1, false, true).then(() => scrollToBottom());
  }, [roomId]);

  const fetchMessages = useCallback(
    async (pageNum: number, append: boolean, isHasMoreInintial: boolean = false) => {
      if ((!roomId || !hasMore) && !isHasMoreInintial) return;

      try {
        const res = await getRoomMessages({
          roomId,
          page: isHasMoreInintial ? 1 : pageNum,
        }).unwrap();
        const newMessages = [...res.data].reverse();

        setMessages((prev) => (append ? [...newMessages, ...prev] : newMessages));
        setHasMore(res.has_more);
        setPage(res.current_page + 1);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    },
    [roomId, hasMore],
  );

  const handleScroll = () => {
    const div = chatBodyRef.current;
    if (!div || isFetching) return;

    if (div.scrollTop === 0 && hasMore) {
      fetchMessages(page, true);
    }
    updateRoomCount();
  };

  const openLightbox = (images: string[], index: number = 0) => {
    if (!images.length) return;
    setSlides(images.map((src) => ({ src })));
    setStartIndex(index);
    setIsOpen(true);
  };

  const handleMessageSent = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  useEffect(() => {
    const div = chatBodyRef.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
      return () => div.removeEventListener('scroll', handleScroll);
    }
  }, [page, hasMore]);

  useEffect(() => {
    import('yet-another-react-lightbox/styles.css');
  }, []);

  useEffect(() => {
    if (roomId) {
      const handleNewMessage = (event: CustomEvent<MessageType>) => {
        if (event.detail.room_id.toString() == roomId) {
          setMessages((prev) => [...prev, event.detail]);
          ScrollBottomOnMessage();
        }
      };

      const listener = handleNewMessage as EventListener;

      window.addEventListener('new-message', listener);

      return () => {
        window.removeEventListener('new-message', listener);
      };
    }
  }, [roomId]);

  return (
    <>
      <div ref={chatBodyRef} className="p-4 space-y-4 flex flex-col overflow-auto relative  h-full">
        {isFetching && page !== 1 && (
          <DynamicIcon name="loader" className="w-6 h-6 animate-spin absolute" />
        )}
        {isFetching && page === 1 ? (
          <DynamicIcon name="loader" className="w-6 h-6 animate-spin absolute" />
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender_id === user.id;
            const hasText = msg.message?.trim();
            const images = msg?.media?.filter((i) => i.type.startsWith('image/')) || [];
            const videos = msg?.media?.filter((i) => i.type.startsWith('video/')) || [];
            const files =
              msg?.media?.filter(
                (i) => !i.type.startsWith('image/') && !i.type.startsWith('video/'),
              ) || [];

            const hasMedia = images.length > 0 || videos.length > 0 || files.length > 0;

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 max-w-[80%] ${
                  isSender ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* 🖼️ Media Bubble */}
                {hasMedia && (
                  <div
                    className={`rounded-2xl shadow-sm p-3 ${
                      isSender ? 'bg-card text-foreground' : 'bg-chat-receiver text-foreground'
                    }`}
                  >
                    <div
                      className={cn('grid  gap-2', {
                        'grid-cols-1': msg.media && msg.media.length === 1,
                        'md:grid-cols-2 grid-cols-1': msg.media && msg.media.length > 1,
                      })}
                    >
                      {/* Images */}
                      {images.map((item, i) => (
                        <img
                          key={i + item.file_name}
                          src={item.file}
                          alt={`image-${i}`}
                          className="w-full h-40 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                          onClick={() =>
                            openLightbox(
                              images.map((i) => i.file),
                              i,
                            )
                          }
                        />
                      ))}

                      {/* Videos */}
                      {videos.map((item, i) => (
                        <div
                          key={i + item.file_name}
                          className="aspect-video rounded-lg bg-black overflow-hidden"
                        >
                          <VideoPlayer src={item.file} type={item.type} />
                        </div>
                      ))}

                      {/* Files */}
                      {files.map((file, i) => (
                        <div
                          key={i + file.file_name}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg border border-border"
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <DynamicIcon
                              name="file-text"
                              className="w-5 h-5 text-primary shrink-0"
                            />
                            <span className="text-sm truncate max-w-[120px]">
                              {file.file_name || 'document'}
                            </span>
                          </div>
                          <a
                            href={file.file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs ml-2 text-blue-500 hover:underline"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasText && (
                  <div
                    className={`rounded-2xl shadow-sm p-3 text-sm leading-relaxed ${
                      isSender ? 'bg-card text-foreground' : 'bg-chat-receiver text-foreground'
                    }`}
                  >
                    {msg.message}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ChatFooter roomId={roomId} onMessageSent={handleMessageSent} />
      <Suspense>
        <Lightbox open={isOpen} close={() => setIsOpen(false)} slides={slides} index={startIndex} />
      </Suspense>
    </>
  );
};

export default ChatBody;
