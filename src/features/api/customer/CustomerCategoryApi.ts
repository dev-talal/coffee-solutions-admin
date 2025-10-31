import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type {
  CustomerCategoryPayload,
  CustomerCategory,
} from '@/common/types/customerCategoryTypes';

const QueryTags: string[] = ['CustomerCategories'];

export const customerCategoryApi = createApi({
  reducerPath: 'customerCategoryApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    customerCategories: build.query<
      PaginatedResponse<CustomerCategory>,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search = '' }) => ({
        url: `/customer/categories`,
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
    allCustomerCategories: build.query<CustomerCategory[], void>({
      query: () => ({
        url: `/fetch/customer/categories`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: CustomerCategory[] }) => response.data,
    }),
    customerCategoryDetails: build.query<
      PaginatedResponse<CustomerCategory>,
      { id: string; search?: string }
    >({
      query: ({ id, search = '' }) => ({
        url: `/customer/categories/${id}`,
        method: 'GET',
        params: {
          search,
        },
      }),
    }),
    addCustomerCategory: build.mutation({
      query: (data: CustomerCategoryPayload) => ({
        url: '/customer/categories',
        method: 'POST',
        data,
      }),
    }),
    editCustomerCategory: build.mutation<void, { id: number; data: CustomerCategoryPayload }>({
      query: ({ id, data }) => ({
        url: `/customer/categories/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteCustomerCategory: build.mutation({
      query: (id: number) => ({
        url: `/customer/categories/${id}`,
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
  useCustomerCategoriesQuery,
  useAllCustomerCategoriesQuery,
  useAddCustomerCategoryMutation,
  useDeleteCustomerCategoryMutation,
  useEditCustomerCategoryMutation,
  useCustomerCategoryDetailsQuery,
} = customerCategoryApi;
