import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  tagTypes: ['Category', 'Search', 'SubCategory'],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    getCategory: builder.query<IPaginatedData<any>, void>({
      query: () => '/product/category/',
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation<any, any>({
      query: body => ({
        url: `/product/category/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Search'],
    }),

    deleteCategory: builder.mutation<any, number>({
      query: id => ({
        url: `/product/category/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Category'],
    }),

    getSingleCategory: builder.query<any, number>({
      query: id => `/product/category/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Search', id },
      ],
    }),

    updateCategory: builder.mutation<
      any,
      { id: number; body: any }
    >({
      query: ({ id, body }) => ({
        url: `/product/category/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: ['Search'],
    }),

    searchCategory: builder.query<any, string>({
      query: query =>
        `product/categories/search/?q=${query}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),

    searchCategoryList: builder.query<
      IPaginatedData<any>,
      {
        search: string
        page: number
      }
    >({
      query: query =>
        `product/categories-list/search/?q=${query.search}&page=${query.page}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),

    searchSubCategory: builder.query<any, number>({
      query: query =>
        `product/categories/${query}/subcategories/`,
      providesTags: (result, error, query) => [
        { type: 'SubCategory', query },
      ],
    }),
  }),
})

export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useSearchCategoryQuery,
  useSearchCategoryListQuery,
  useSearchSubCategoryQuery,
} = categoriesApi
