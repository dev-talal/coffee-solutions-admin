import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { ProductUnit } from '@/common/types/productTypes';
import type { ProductUnitValues } from '@/utils/validations/product';

const QueryTags: string[] = ['ProductUnits'];

export const productUnitApi = createApi({
  reducerPath: 'productUnitApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    ProductUnits: build.query<PaginatedResponse<ProductUnit>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/product/units?page=${page}`,
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
    allProductUnits: build.query<ProductUnit[], void>({
      query: () => ({
        url: `/product/units`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: ProductUnit[] }) => response.data,
    }),
    ProductUnitDetails: build.query<ProductUnit, number | void | string>({
      query: (id) => ({
        url: `/product/units/${id}`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: ProductUnit }) => response.data,
    }),
    addProductUnit: build.mutation({
      query: (data: ProductUnitValues) => ({
        url: '/product/units',
        method: 'POST',
        data,
      }),
      invalidatesTags: (result) => [
        { type: QueryTags[0], id: result?.id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    editProductUnit: build.mutation<void, { id: number; data: ProductUnitValues }>({
      query: ({ id, data }) => ({
        url: `/product/units/${id}`,
        method: 'POST',
        data: { ...data, _method: 'PUT' },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    deleteProductUnit: build.mutation({
      query: (id: number) => ({
        url: `/product/units/${id}`,
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
  useProductUnitsQuery,
  useAllProductUnitsQuery,
  useProductUnitDetailsQuery,
  useAddProductUnitMutation,
  useEditProductUnitMutation,
  useDeleteProductUnitMutation,
} = productUnitApi;
