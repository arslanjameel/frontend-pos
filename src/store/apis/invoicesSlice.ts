import { createApi } from '@reduxjs/toolkit/query/react'

import {
  IPaginatedData,
  IPaginatedDataParams,
} from 'src/models/shared/IPaginatedData'

import {
  IInvoiceStatus,
  ISaleInvoice,
  ISaleInvoiceNew,
  ISaleInvoiceUpdate,
} from 'src/models/ISaleInvoice'
import { customBaseQuery } from '../utils/customBaseQuery'
import { getPaginationParams } from 'src/utils/apiUtils'
import { ITransactionType } from 'src/models/ITransactionType'

export const invoicesApi = createApi({
  reducerPath: 'invoicesApi',
  tagTypes: [
    'SaleInvoice',
    'SaleInvoiceSearched',
    'TransactionTypes',
  ],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getInvoices: builder.query<
      IPaginatedData<ISaleInvoice>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/sale/sale-invoices/?page=${_params.page}`,
          method: 'GET',
        }
      },

      providesTags: ['SaleInvoice'],
    }),

    getInvoicesSearch: builder.query<
      IPaginatedData<ISaleInvoice>,
      {
        page: number
        searchTerm?: string
        startDate?: string
        endDate?: string
        status?: IInvoiceStatus | string
        store?: number
      }
    >({
      query: params => {
        let queryString = `/sale/invoice/search/?page=${
          params.page || 1
        }&`

        queryString += `search_term=${params.searchTerm}`

        if (params.startDate) {
          queryString += queryString.includes('?')
            ? '&'
            : ''
          queryString += `start_date=${params.startDate}`
        }
        if (params.endDate) {
          queryString += queryString.includes('?')
            ? '&'
            : ''
          queryString += `end_date=${params.endDate}`
        }
        if (params.status) {
          queryString +=
            queryString.includes('?') ||
            queryString.includes('&')
              ? '&'
              : ''
          queryString += `status=${params.status}`
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
      providesTags: ['SaleInvoiceSearched'], //TODO: improve this
    }),

    createInvoice: builder.mutation<
      ISaleInvoice,
      ISaleInvoiceNew
    >({
      query: body => ({
        url: `/sale/sale-invoices/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'SaleInvoice',
        'SaleInvoiceSearched',
      ],
    }),
    getSingleInvoice: builder.query<ISaleInvoice, number>({
      query: id => `/sale/sale-invoices/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'SaleInvoice', id },
      ],
    }),
    updateInvoice: builder.mutation<
      ISaleInvoice,
      { id: number; body: ISaleInvoiceUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/sale/sale-invoices/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: [
        'SaleInvoice',
        'SaleInvoiceSearched',
      ],
    }),
    deleteInvoice: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-invoices/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: [
        'SaleInvoice',
        'SaleInvoiceSearched',
      ],
    }),

    /**
     *
     * Transaction Type
     *
     */

    getTransactionTypes: builder.query<
      IPaginatedData<ITransactionType>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/sale/transaction-types/?page=${_params.page}`,
          method: 'GET',
        }
      },

      providesTags: ['TransactionTypes'],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoicesSearchQuery,
  useGetSingleInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,

  useGetTransactionTypesQuery,
} = invoicesApi
