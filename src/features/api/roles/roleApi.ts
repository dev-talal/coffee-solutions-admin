import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { Permission, Role, RolePayload } from '@/common/types/roleType';
import type { PaginatedResponse } from '@/common/types/commonTypes';

const QueryTags: string[] = ['Roles'];

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    permissions: build.query<Permission[], void>({
      query: () => ({
        url: '/permissions?type=all',
        method: 'GET',
      }),
      transformResponse: (response: { data: Permission[] }) => response.data,
    }),
    allRoles: build.query<Role[], void>({
      query: () => ({
        url: '/roles?type=all',
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Role[] }) => response.data,
    }),
    roles: build.query<PaginatedResponse<Role>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/roles`,
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
    addRole: build.mutation({
      query: (data: RolePayload) => ({
        url: '/roles',
        method: 'POST',
        data,
      }),
    }),
    editRole: build.mutation<void, { id: number; data: RolePayload }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteRole: build.mutation({
      query: (id: number) => ({
        url: `/roles/${id}`,
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
  usePermissionsQuery,
  useRolesQuery,
  useAllRolesQuery,
  useAddRoleMutation,
  useEditRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
