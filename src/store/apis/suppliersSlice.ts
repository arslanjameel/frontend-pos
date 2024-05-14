import { createApi } from '@reduxjs/toolkit/query/react'

import {
  IPaginatedData,
  IPaginatedDataParams,
} from 'src/models/shared/IPaginatedData'

import { customBaseQuery } from '../utils/customBaseQuery'
import { getPaginationParams } from 'src/utils/apiUtils'
import {
  ISupplier,
  ISupplierNew,
  ISupplierUpdate,
} from 'src/models/ISupplier'

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  tagTypes: ['ISupplier', 'ISupplierSearched', 'Search'],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getSuppliers: builder.query<
      IPaginatedData<ISupplier>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/suppliers/suppliers/?page=${_params.page}`,
          method: 'GET',
        }
      },

      providesTags: ['ISupplier'],
    }),

    getSuppliersSearch: builder.query<
      IPaginatedData<ISupplier>,
      {
        page: number
        searchTerm?: string
        store?: number
      }
    >({
      query: params => {
        let queryString = `/suppliers/search/?page=${
          params.page || 1
        }`

        // queryString += `search_term=${params.searchTerm}`

        if (params.searchTerm) {
          queryString +=
            queryString.includes('?') ||
            queryString.includes('&')
              ? '&'
              : ''
          queryString += `search_term=${params.searchTerm}`
        }

        if (params.store) {
          queryString +=
            queryString.includes('?') ||
            queryString.includes('&')
              ? '&'
              : ''
          queryString += `store=${params.store}`
        }

        return {
          url: queryString,
          method: 'GET',
        }
      },
    }),

    createSupplier: builder.mutation<
      ISupplier,
      ISupplierNew
    >({
      query: body => ({
        url: `/suppliers/suppliers/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ISupplier'],
    }),

    getSingleSupplier: builder.query<ISupplier, number>({
      query: id => `/suppliers/suppliers/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'ISupplier', id },
      ],
    }),

    updateSupplier: builder.mutation<
      ISupplier,
      { id: number; body: ISupplierUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/suppliers/suppliers/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['ISupplier'],
    }),

    deleteSupplier: builder.mutation<any, number>({
      query: id => ({
        url: `/suppliers/suppliers/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['ISupplier'],
    }),

    searchSupplier: builder.query<any, string>({
      query: query => `/suppliers/search/?q=${query}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useGetSuppliersSearchQuery,
  useGetSingleSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useSearchSupplierQuery,
} = suppliersApi
