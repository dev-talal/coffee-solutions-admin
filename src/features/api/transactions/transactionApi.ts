import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { TransactionResponse } from '@/common/types/transactionType';

const QueryTags: string[] = ['Transactions'];

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    transactions: build.query<TransactionResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: `/dashboard/transactions`,
        method: 'GET',
        params: {
          page,
        },
      }),
      providesTags: (result) =>
        result?.data?.transactions?.data
          ? [
              ...result.data.transactions.data.map(({ id }: { id: number }) => ({
                type: QueryTags[0],
                id,
              })),
              { type: QueryTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),
  }),
});

export const { useTransactionsQuery } = transactionsApi;
