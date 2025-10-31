import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import { toFormData } from 'axios';
import type { Promotion, PromotionRequestPayload } from '@/common/types/promotionTypes';

const QueryTags: string[] = ['Promotions'];

export const promotionApi = createApi({
  reducerPath: 'promotionApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    Promotions: build.query<PaginatedResponse<Promotion>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/promotions?page=${page}`,
        method: 'GET',
        params: {
          page,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: QueryTags[0] as string, id })),
              { type: QueryTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),
    allPromotions: build.query<Promotion[], void>({
      query: () => ({
        url: `/promotions`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Promotion[] }) => response.data,
    }),
    PromotionDetails: build.query<Promotion, number | void | string>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Promotion }) => response.data,
    }),
    addPromotion: build.mutation({
      query: (data: PromotionRequestPayload) => ({
        url: '/promotions',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: (result) => [
        ...(result ? [{ type: QueryTags[0], id: result.id }] : []),
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    editPromotion: build.mutation<void, { id: number; data: PromotionRequestPayload }>({
      query: ({ id, data }) => ({
        url: `/promotions/${id}`,
        method: 'POST',
        data: { ...data, _method: 'put' },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    deletePromotion: build.mutation({
      query: (id: number) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (id) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    uploadPromotionImage: build.mutation({
      query: (data: { image: File }) => ({
        url: '/upload/image',
        method: 'POST',
        data: toFormData(data),
      }),
    }),
  }),
});

export const {
  usePromotionsQuery,
  useAddPromotionMutation,
  useDeletePromotionMutation,
  useEditPromotionMutation,
  usePromotionDetailsQuery,
  useAllPromotionsQuery,
  useUploadPromotionImageMutation,
} = promotionApi;
