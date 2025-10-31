import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { ChatRoomData, MessageType, PostMessagePayload } from '@/common/types/chatTypes';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const authToken = Cookies.get(config.AUTH_COOKIE_NAME);

export const ChatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),

  endpoints: (build) => ({
    getRooms: build.query<ChatRoomData[], void>({
      query: () => ({
        url: `/chat/rooms`,
        method: 'GET',
      }),
      transformResponse: (response: { data: ChatRoomData[] }) => response.data,
    }),
    getRoomMessages: build.query<
      {
        data: MessageType[];
        has_more: boolean;
        current_page: number;
        unread_count: number;
        room: ChatRoomData;
      },
      { roomId: string; page?: number }
    >({
      query: ({ roomId, page = 1 }) => ({
        url: `/chat`,
        method: 'GET',
        params: { room_id: roomId, page },
      }),

      async onQueryStarted({ roomId }, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const unreadCount = response.unread_count;

          dispatch(
            ChatApi.util.updateQueryData('getRooms', undefined, (rooms) => {
              const room = rooms.find((r) => r.id == roomId);
              if (room) {
                room.unread_messages_count = unreadCount;
              }
            }),
          );
        } catch (error) {
          console.error('Failed to update room unread count:', error);
        }
      },

      transformResponse: (response: {
        data: MessageType[];
        has_more: boolean;
        current_page: number;
        unread_count: number;
        room: ChatRoomData;
      }) => response,
    }),
    postMessage: build.mutation<
      {
        data: MessageType;
      },
      { message: PostMessagePayload }
    >({
      query: ({ message }) => ({
        url: `/chat`,
        method: 'POST',
        data: message,
      }),

      async onQueryStarted({ message }, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const latestMessage = response.data;

          dispatch(
            ChatApi.util.updateQueryData('getRooms', undefined, (rooms) => {
              const room = rooms.find((r) => r.id == message.room_id);
              if (room) {
                room.last_message = latestMessage;
              }
            }),
          );
        } catch (error) {
          console.error('Failed to update room unread count:', error);
        }
      },

      transformResponse: (response: { data: MessageType }) => response,
    }),
    uploadFile: build.mutation<
      { data: string },
      { file: File; onProgress?: (progress: number) => void }
    >({
      async queryFn({ file, onProgress }) {
        try {
          const formData = new FormData();
          formData.append('media', file);

          const response = await axios.post(`${config.API_BASE_URL}/chat/media/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authToken}`,
            },
            onUploadProgress: (event) => {
              if (event.total && onProgress) {
                const percent = Math.round((event.loaded * 100) / event.total);
                onProgress(percent);
              }
            },
          });

          return { data: response.data };
        } catch (err) {
          const error = err as { data: unknown } & AxiosError;
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useLazyGetRoomMessagesQuery,
  usePostMessageMutation,
  useUploadFileMutation,
} = ChatApi;
