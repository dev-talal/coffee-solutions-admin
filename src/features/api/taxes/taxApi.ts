import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Taxes } from '@/common/types/taxesTypes';
import type { TaxesValues } from '@/utils/validations/taxes';

const QueryTags: string[] = ['Taxes'];

export const taxesApi = createApi({
  reducerPath: 'taxesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    taxes: build.query<PaginatedResponse<Taxes>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/taxes`,
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
    addTaxes: build.mutation({
      query: (data: TaxesValues) => ({
        url: '/taxes',
        method: 'POST',
        data,
      }),
    }),
    editTaxes: build.mutation<void, { id: number; data: TaxesValues }>({
      query: ({ id, data }) => ({
        url: `/taxes/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteTaxes: build.mutation({
      query: (id: number) => ({
        url: `/taxes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const { useTaxesQuery, useAddTaxesMutation, useDeleteTaxesMutation, useEditTaxesMutation } =
  taxesApi;
