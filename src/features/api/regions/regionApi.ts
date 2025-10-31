import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import type { Region, RegionPayload } from '@/common/types/regionTypes';
import type { City } from '@/common/types/cityTypes';
import type { Warehouse } from '@/common/types/warehouseTypes';

const QueryTags: string[] = ['Regions'];

interface WareHouseCities {
  cities: City[];
  warehouses: Warehouse[];
}

export const regionApi = createApi({
  reducerPath: 'regionApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    regions: build.query<PaginatedResponse<Region>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => ({
        url: `/regions`,
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
    allRegions: build.query<Region[], void>({
      query: () => ({
        url: `/fetch/regions`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: Region[] }) => response.data,
    }),
    getWareHousesandCitiesByRegion: build.query<WareHouseCities, string | void>({
      query: (id) => ({
        url: `/fetch/region/${id}/cities/warehouses`,
        method: 'GET',
      }),
      forceRefetch: () => true,
      transformResponse: (response: { data: WareHouseCities }) => response.data,
    }),
    addRegion: build.mutation({
      query: (data: RegionPayload) => ({
        url: '/regions',
        method: 'POST',
        data,
      }),
    }),
    editRegion: build.mutation<void, { id: number; data: RegionPayload }>({
      query: ({ id, data }) => ({
        url: `/regions/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteRegion: build.mutation({
      query: (id: number) => ({
        url: `/regions/${id}`,
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
  useRegionsQuery,
  useAddRegionMutation,
  useDeleteRegionMutation,
  useEditRegionMutation,
  useAllRegionsQuery,
  useGetWareHousesandCitiesByRegionQuery,
} = regionApi;
