import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Order, Warehouse } from '@/common/types/orderTypes';

const QueryTags: string[] = ['Orders'];
const WarehouseTags: string[] = ['Warehouse'];
const OrderTransferTags: string[] = ['OrderTransfer'];
const OrderDispatchTags: string[] = ['OrderDispatch'];

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    orders: build.query<PaginatedResponse<Order>, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: `/dashboard/orders`,
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
    OrderDetails: build.query<Order, number | void | string>({
      query: (id) => ({
        url: `/order/details/${id}`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Order }) => response.data,
    }),
    updateOrderStatus: build.mutation({
      query: (data: { order_id: number; status: string }) => ({
        url: `/update/order/status`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (result) => [
        ...(result ? [{ type: QueryTags[0], id: result.id }] : []),
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
        { type: 'Orders', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const warehouseApi = createApi({
  reducerPath: 'warehouseApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: WarehouseTags,
  endpoints: (build) => ({
    warehouses: build.query<Warehouse[], void>({
      query: () => ({
        url: `/fetch/warehouses`,
        method: 'GET',
      }),
      transformResponse: (response: PaginatedResponse<Warehouse>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: WarehouseTags[0], id })),
              { type: WarehouseTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: WarehouseTags[0], id: 'PARTIAL-LIST' }],
    }),
  }),
});

export const orderTransferApi = createApi({
  reducerPath: 'orderTransferApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: OrderTransferTags,
  endpoints: (build) => ({
    transferOrder: build.mutation({
      query: (data: { order_id: number; transfer_to: number; driver_id?: number }) => ({
        url: `/order/transfer`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (result) => [
        ...(result ? [{ type: OrderTransferTags[0], id: result.id }] : []),
        { type: OrderTransferTags[0], id: 'PARTIAL-LIST' },
        { type: 'Orders', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const orderDispatchApi = createApi({
  reducerPath: 'orderDispatchApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: OrderDispatchTags,
  endpoints: (build) => ({
    dispatchOrder: build.mutation({
      query: (data: { order_id: number; driver_id: number }) => ({
        url: `/order/assign/driver`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (result) => [
        ...(result ? [{ type: OrderDispatchTags[0], id: result.id }] : []),
        { type: OrderDispatchTags[0], id: 'PARTIAL-LIST' },
        { type: 'Orders', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const { useWarehousesQuery } = warehouseApi;
export const { useOrdersQuery, useOrderDetailsQuery, useUpdateOrderStatusMutation } = ordersApi;
export const { useTransferOrderMutation } = orderTransferApi;
export const { useDispatchOrderMutation } = orderDispatchApi;
