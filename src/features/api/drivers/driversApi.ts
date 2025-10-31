import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Driver, DriverPayload } from '@/common/types/driverTypes';

const QueryTags = ['Drivers'];

export const driversApi = createApi({
  reducerPath: 'driversApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    getDrivers: build.query<PaginatedResponse<Driver>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: '/drivers',
        method: 'GET',
        params: { page, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((driver) => ({ type: QueryTags[0], id: driver.id })),
              { type: QueryTags[0], id: 'PARTIAL-LIST' },
            ]
          : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),

    getDriverById: build.query<Driver, number>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: QueryTags[0], id }],
    }),

    createDriver: build.mutation<Driver, DriverPayload>({
      query: (data) => ({
        url: '/drivers',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: QueryTags[0], id: 'PARTIAL-LIST' }],
    }),

    updateDriver: build.mutation<void, { id: number; data: DriverPayload }>({
      query: ({ id, data }) => ({
        url: `/drivers/${id}`,
        method: 'POST',
        data: { _method: 'PUT', ...data },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),

    deleteDriver: build.mutation<void, number>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),

    getDriversByOrder: build.query<Driver[], number>({
      query: (orderId) => ({
        url: `/drivers/by/order/${orderId}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: Driver[] }) => response.data,
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useGetDriversByOrderQuery,
} = driversApi;
