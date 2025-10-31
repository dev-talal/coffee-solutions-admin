import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { CustomerCareUsers, Warehouse } from '@/common/types/warehouseTypes';
import type { WarehouseFormValues } from '@/utils/validations/warehouse';

const QueryTags: string[] = ['Warehouse'];

export const wareHouseApi = createApi({
  reducerPath: 'wareHouseApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    warehouse: build.query<PaginatedResponse<Warehouse>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/warehouse`,
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
    allWareHouse: build.query<Warehouse[], void>({
      query: () => ({
        url: '/warehouse?type=all',
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Warehouse[] }) => response.data,
    }),
    customerCareUsersByWarehouse: build.query<CustomerCareUsers, string | void>({
      query: (id) => ({
        url: `/fetch/warehouse/${id}/customer-care-users`,
        method: 'GET',
      }),
      transformResponse: (response: { data: CustomerCareUsers }) => response.data,
    }),
    addWarehouse: build.mutation({
      query: (data: WarehouseFormValues) => ({
        url: '/warehouse',
        method: 'POST',
        data,
      }),
    }),
    editWarehouse: build.mutation<void, { id: number; data: WarehouseFormValues }>({
      query: ({ id, data }) => ({
        url: `/warehouse/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteWarehouse: build.mutation({
      query: (id: number) => ({
        url: `/warehouse/${id}`,
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
  useWarehouseQuery,
  useAddWarehouseMutation,
  useEditWarehouseMutation,
  useDeleteWarehouseMutation,
  useAllWareHouseQuery,
  useCustomerCareUsersByWarehouseQuery,
} = wareHouseApi;
