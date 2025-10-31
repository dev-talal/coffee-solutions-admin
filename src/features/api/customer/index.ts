import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Customer } from '@/common/types/customerTypes';
import type { CustomerValues } from '@/utils/validations/customer';

const QueryTags: string[] = ['Customer'];

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    customer: build.query<PaginatedResponse<Customer>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/customers`,
        method: 'GET',
        params: {
          page,
          ...(search ? { search } : {}),
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
    customerDetails: build.query<PaginatedResponse<Customer>, { id: string; search?: string }>({
      query: ({ id, search = '' }) => ({
        url: `/customer/${id}`,
        method: 'GET',
        params: {
          search,
        },
      }),
    }),
    addCustomer: build.mutation({
      query: (data: CustomerValues) => ({
        url: '/customers',
        method: 'POST',
        data,
      }),
    }),
    editCustomer: build.mutation<void, { id: number; data: CustomerValues }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'POST',
        data: { ...data, _method: 'PUT' },
      }),
    }),
    deleteCustomer: build.mutation({
      query: (id: number) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const {
  useCustomerQuery,
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useCustomerDetailsQuery,
} = customerApi;
