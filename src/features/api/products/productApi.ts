import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import { toFormData } from 'axios';
import type { Product } from '@/common/types/productTypes';
import type { ProductValues } from '@/utils/validations/product';

const QueryTags: string[] = ['Products'];

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    Products: build.query<PaginatedResponse<Product>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/products?page=${page}`,
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
    allProducts: build.query<Product[], void>({
      query: () => ({
        url: `/products`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Product[] }) => response.data,
    }),
    ProductDetails: build.query<Product, number | void | string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Product }) => response.data,
    }),
    addProduct: build.mutation({
      query: (data: ProductValues) => ({
        url: '/products',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: (result) => [
        { type: QueryTags[0], id: result?.id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    editProduct: build.mutation<void, { id: number; data: ProductValues }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'POST',
        data: { ...data, _method: 'put' },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    deleteProduct: build.mutation({
      query: (id: number) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
    uploadProductImage: build.mutation({
      query: (data: { image: File }) => ({
        url: '/upload/image',
        method: 'POST',
        data: toFormData(data),
      }),
    }),
  }),
});

export const {
  useProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useProductDetailsQuery,
  useAllProductsQuery,
  useUploadProductImageMutation,
} = productApi;
