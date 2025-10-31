import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { CustomerCartItem } from '@/common/types/customerItemsTypes';

const QueryTags: string[] = ['CustomerCart'];

export const customerCartApi = createApi({
  reducerPath: 'customerCartApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    customerCart: build.query<PaginatedResponse<CustomerCartItem>, string>({
      query: (id) => ({
        url: `/dashboard/customer/${id}/cart`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: QueryTags[0], id })),
              { type: QueryTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),
  }),
});

export const { useCustomerCartQuery } = customerCartApi;
