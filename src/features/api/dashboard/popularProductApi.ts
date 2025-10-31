import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { PopularProducts } from '@/common/types/popularProductTypes';

const QueryTags: string[] = ['popular'];

export const popularProductsApi = createApi({
  reducerPath: 'popularProductsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    popularProducts: build.query<PaginatedResponse<PopularProducts>, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: `/dashboard/popular/products`,
        method: 'GET',
        params: {
          page,
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
  }),
});

export const { usePopularProductsQuery } = popularProductsApi;
