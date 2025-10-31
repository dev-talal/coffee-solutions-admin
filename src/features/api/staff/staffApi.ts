import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Staff } from '@/common/types/staffTypes';
import type { StaffValues } from '@/utils/validations/staff';

const QueryTags: string[] = ['Staff'];

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    staff: build.query<PaginatedResponse<Staff>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/staff`,
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
    addStaff: build.mutation({
      query: (data: StaffValues) => ({
        url: '/staff',
        method: 'POST',
        data,
      }),
    }),
    editStaff: build.mutation<void, { id: number; data: StaffValues }>({
      query: ({ id, data }) => ({
        url: `/staff/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteStaff: build.mutation({
      query: (id: number) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const { useStaffQuery, useAddStaffMutation, useDeleteStaffMutation, useEditStaffMutation } =
  staffApi;
