import axios from 'axios';
import { store } from '@/store';
import { logoutUser } from '@/features/slices/auth/authSlice';
import toast from 'react-hot-toast';
import { openResponseDialog } from '@/features/slices/response/responseDialogSlice';

import type { Method, AxiosError } from 'axios';

export const GENERAL_API_ERR_MSG =
  'Unable to process this request. Please try again. If the issue persists, please contact support.';

const excludedUrls: string[] = [
  'upload-image',
  'upload-file',
  'media',
  'image/',
  'grapgh',
  'cards/data',
  'logout',
  'chat',
  'login',
  'upload',
];

type AxiosBaseQueryArgs = {
  baseUrl?: string;
};

type RequestArgs = {
  url: string;
  method: Method;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

type AxiosBaseQueryReturn<T = unknown> = Promise<
  | { data: T }
  | {
      error: {
        status?: number;
        data: unknown;
      };
    }
>;

const axiosBaseQuery =
  ({ baseUrl = '' }: AxiosBaseQueryArgs = {}): ((args: RequestArgs) => AxiosBaseQueryReturn) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const token = store.getState().auth.token;

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      if (
        !excludedUrls.some((endpoint) => url.endsWith(endpoint)) &&
        method.toLowerCase() !== 'get'
      ) {
        store.dispatch(openResponseDialog(result.data.message || 'Request successful'));
      }

      return { data: result.data };
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        store.dispatch(logoutUser());
      }

      toast.error(
        ((error.response?.data as Record<string, unknown>)?.message as string) ??
          error.message ??
          GENERAL_API_ERR_MSG,
      );

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

export default axiosBaseQuery;
