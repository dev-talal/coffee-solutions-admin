import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { ProductPayload, Product } from '@/common/types/productCategoryTypes';
import { toFormData } from 'axios';

const QueryTags: string[] = ['ProductCategories'];

export const productCategoryApi = createApi({
  reducerPath: 'productCategoryApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    ProductCategories: build.query<PaginatedResponse<Product>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/product/categories?page=${page}`,
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
    allProductCategories: build.query<Product[], void>({
      query: () => ({
        url: `/product/categories?type=all`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Product[] }) => response.data,
    }),
    allChildProductCategories: build.query<Product[], void>({
      query: () => ({
        url: `/child/categories`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Product[] }) => response.data,
    }),
    allParentProductCategories: build.query<Product[], void>({
      query: () => ({
        url: `/parent/categories`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Product[] }) => response.data,
    }),
    ProductCategoryDetails: build.query<PaginatedResponse<Product>, number | void | string>({
      query: (id) => ({
        url: `/product/categories/${id}`,
        method: 'GET',
      }),
    }),
    addProductCategory: build.mutation({
      query: (data: ProductPayload) => ({
        url: '/product/categories',
        method: 'POST',
        data: toFormData(data),
      }),
    }),
    editProductCategory: build.mutation<void, { id: number; data: ProductPayload }>({
      query: ({ id, data }) => ({
        url: `/product/categories/${id}`,
        method: 'POST',
        data: toFormData({ ...data, _method: 'put' }),
      }),
    }),
    deleteProductCategory: build.mutation({
      query: (id: number) => ({
        url: `/product/categories/${id}`,
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
  useProductCategoriesQuery,
  useAddProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useEditProductCategoryMutation,
  useProductCategoryDetailsQuery,
  useAllProductCategoriesQuery,
  useAllChildProductCategoriesQuery,
  useAllParentProductCategoriesQuery,
} = productCategoryApi;
