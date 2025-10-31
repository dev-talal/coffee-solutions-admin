import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { EmailValues, ResetPasswordValues } from '@/utils/validations/auth';
import type { ProfileSchemaType } from '@/utils/validations/auth/profile';
import { toFormData } from 'axios';

export interface ResetPasswordValuesModified extends ResetPasswordValues {
  email?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: '/login',
        method: 'POST',
        data,
      }),
    }),
    checkAuth: build.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),
    editProfile: build.mutation({
      query: (data: ProfileSchemaType) => ({
        url: '/auth/update-profile',
        method: 'POST',
        data: toFormData(data),
      }),
    }),
    forgetPassword: build.mutation({
      query: (data: EmailValues) => ({
        url: '/forgot-password',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data: ResetPasswordValuesModified) => ({
        url: '/auth/change-password',
        method: 'POST',
        data: toFormData(data),
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCheckAuthQuery,
  useLogoutMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useEditProfileMutation,
} = authApi;
