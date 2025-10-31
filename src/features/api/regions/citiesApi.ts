import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type { City, CityPayload, SingleRegionCities } from '@/common/types/cityTypes';

const QueryTags: string[] = ['Cities'];

export const cityApi = createApi({
  reducerPath: 'cityApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    regionCity: build.query<City, number>({
      query: (id) => ({
        url: `/cities/${id}`,
        method: 'GET',
      }),
    }),
    cities: build.query<SingleRegionCities, { page?: number; region_id?: string; search?: string }>(
      {
        query: ({ page = 1, region_id = '', search = '' }) => ({
          url: `/fetch/region/${region_id}/cities`,
          method: 'GET',
          params: {
            page,
            search,
          },
        }),
        providesTags: (result) => {
          return result
            ? [
                ...result.data.cities.data.map(({ id }) => ({ type: QueryTags[0] as string, id })),
                { type: QueryTags[0], id: 'PARTIAL-LIST' },
              ]
            : [{ type: QueryTags[0], id: 'PARTIAL-LIST' }];
        },
      },
    ),
    addCity: build.mutation({
      query: (data: CityPayload) => ({
        url: '/cities?type=paginated',
        method: 'POST',
        data,
      }),
    }),
    editCity: build.mutation<void, { id: number; data: CityPayload }>({
      query: ({ id, data }) => ({
        url: `/cities/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteCity: build.mutation({
      query: (id: number) => ({
        url: `/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [
        { type: QueryTags[0], id },
        { type: QueryTags[0], id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const { useCitiesQuery, useAddCityMutation, useDeleteCityMutation, useEditCityMutation } =
  cityApi;
