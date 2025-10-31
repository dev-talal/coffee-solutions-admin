import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Banner } from '@/common/types/bannerTypes';
import { toFormData } from 'axios';
import type { BannerFormValues } from '@/utils/validations/banner';

const QueryTags = ['Banners'];

export const BannersApi = createApi({
  reducerPath: 'BannersApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    getBanners: build.query<PaginatedResponse<Banner>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: '/banners',
        method: 'GET',
        params: { page, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((Banner) => ({ type: QueryTags[0], id: Banner.id })),
              { type: QueryTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),

    getBannerById: build.query<Banner, number>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: QueryTags[0], id }],
    }),

    createBanner: build.mutation<Banner, BannerFormValues>({
      query: (data) => ({
        url: '/banners',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),

    updateBanner: build.mutation<void, { id: number; data: BannerFormValues }>({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: 'POST',
        data: { _method: 'PUT', ...data },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),

    deleteBanner: build.mutation<void, number>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    uploadBannerImage: build.mutation<{ data: string }, { file: File }>({
      query: (payload) => ({
        url: `/banners/upload`,
        method: 'POST',
        data: toFormData(payload),
      }),
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation,
} = BannersApi;
