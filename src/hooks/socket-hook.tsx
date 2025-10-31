import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { connectReverb, type MessageDataBase } from '@/lib/socket';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ordersApi } from '@/features/api/orders/ordersApi';
import { ChatApi } from '@/features/api/chat/ChatApi';
import { useAppDispatch, type RootState } from '@/store';
import type { PaginatedResponse } from '../common/types/commonTypes';
import type { Order } from '@/common/types/orderTypes';
import type { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import type { MessageType } from '@/common/types/chatTypes';

interface QueryCacheEntry {
  data?: PaginatedResponse<Order>;
  fulfilledTimeStamp?: number;
  status?: string;
  endpointName?: string;
  requestId?: string;
  startedTimeStamp?: number;
  isUninitialized?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: unknown;
  meta?: FetchBaseQueryMeta;
}

export const useSocketHook = () => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  const currentPage = useSelector((state: RootState) => {
    const allQueries = state.ordersApi.queries as Record<string, QueryCacheEntry>;
    const entries = Object.entries(allQueries);

    let latest: QueryCacheEntry | null = null;

    for (const [, value] of entries) {
      if (value?.data?.meta?.current_page) {
        if (!latest || (value.fulfilledTimeStamp ?? 0) > (latest.fulfilledTimeStamp ?? 0)) {
          latest = value;
        }
      }
    }

    return latest?.data?.meta?.current_page ?? 1;
  });

  const currentPageRef = useRef<number>(1);
  currentPageRef.current = currentPage;

  const updateOrderData = useCallback((msg: MessageDataBase) => {
    try {
      const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
      if (window.location.pathname.includes('orders') && currentPageRef.current === 1) {
        dispatch(
          ordersApi.util.updateQueryData('orders', { page: 1 }, (draft) => {
            if (draft?.data) {
              draft.data.unshift(parsed.message);
            }
          }),
        );
      }

      toast.success('New order received');
    } catch (error) {
      console.error('Socket message parse error:', error);
    }
  }, []);

  const updateRoomData = useCallback(
    (msg: MessageDataBase) => {
      try {
        const { message } = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
        const roomId = message.room.id;

        dispatch(
          ChatApi.util.updateQueryData('getRooms', undefined, (rooms) => {
            if (!rooms) return;
            const existingIndex = rooms.findIndex((r) => r.id == roomId);

            if (existingIndex !== -1) {
              rooms.splice(existingIndex, 1);
              rooms.unshift(message.room);
            } else {
              rooms.unshift(message.room);
            }
          }),
        );
        window.dispatchEvent(new CustomEvent<MessageType>('new-message', { detail: message }));
      } catch (error) {
        console.error('Socket message parse error:', error);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (user?.id && isAuthenticated) {
      const socket = connectReverb({
        userId: user.id,
        onMessage: (msg) => {
          if (msg.event === 'new.order') {
            updateOrderData(msg);
          }

          if (msg.event === 'message.sent') {
            updateRoomData(msg);
          }
        },
      });

      return () => socket.close();
    }
  }, [user, isAuthenticated]);
};
