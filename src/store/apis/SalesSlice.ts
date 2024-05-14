import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { IPaginatedDataParams } from 'src/models/shared/IPaginatedData'
import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import { IQuote } from 'src/models/IQuote'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { getPaginationParams } from 'src/utils/apiUtils'
import { ISaleReturn } from 'src/models/ISaleReturn'

export const SalesApi = createApi({
  reducerPath: 'SalesApi',
  tagTypes: ['Sales', 'InvoiceReturns'],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    /*
     *
     * Sales
     *
     */
    getSales: builder.query<
      IPaginatedData<ISaleInvoice>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/sale/return/search/?page=${_params.page}`,
          method: 'GET',
        }
      },

      providesTags: ['Sales'],
    }),

    createOrder: builder.mutation<IQuote, any>({
      query: body => ({
        url: `/sale/sale-order/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sales'],
    }),
    getSingleSale: builder.query<any, number>({
      query: id => `/sale/sale-order/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Sales', id },
      ],
    }),
    deleteSingleSaleorder: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-order/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Sales'],
    }),

    getSaleSearch: builder.query<
      IPaginatedData<ISaleInvoice>,
      {
        page: number
        searchTerm?: string
        startDate?: string
        endDate?: string
        status?: string
      }
    >({
      query: params => {
        let queryString = '/sale/order/search/'
        if (params.searchTerm) {
          queryString += `?search_term=${params.searchTerm}`
        }

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

        return {
          url: queryString,
          method: 'GET',
        }
      },

      // providesTags: ['SaleInvoiceSearched'], //TODO: improve this
    }),

    /*
     *
     * Credit Sales
     *
     */
    getSalesreturn: builder.query<
      IPaginatedData<IQuote>,
      void
    >({
      query: () => '/sale/sale-returns/',
      providesTags: ['Sales'],
    }),

    getSinglereturnSale: builder.query<any, number>({
      query: id => `/sale/sale-returns/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Sales', id },
      ],
    }),
    deleteSingleSalereturnorder: builder.mutation<
      any,
      number
    >({
      query: id => ({
        url: `/sale/sale-returns/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Sales'],
    }),
    createSalereturn: builder.mutation<IQuote, any>({
      query: body => ({
        url: `/sale/sale-returns/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sales'],
    }),

    getCreditSaleSearch: builder.query<
      IPaginatedData<ISaleInvoice>,
      {
        page: number
        searchTerm?: string
        startDate?: string
        endDate?: string
        status?: string
        store?: number
      }
    >({
      query: params => {
        let queryString = '/sale/return/search/?'

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
        if (params.store) {
          queryString += queryString.includes('?')
            ? '&'
            : ''
          queryString += `store=${params.store}`
        }
        if (params.status) {
          queryString +=
            queryString.includes('?') ||
            queryString.includes('&')
              ? '&'
              : ''
          queryString += `status=${params.status}`
        }

        return {
          url: queryString,
          method: 'GET',
        }
      },

      // providesTags: ['SaleInvoiceSearched'], //TODO: improve this
    }),
    getInvoice: builder.query<any, number>({
      query: id =>
        `/sale/invoice/search/?search_term=${id}`,
      providesTags: (result, error, id) => [
        { type: 'Sales', id },
      ],
    }),

    /**
     *
     * Invoice Returns - Credit Notes
     *
     * */
    getInvoiceReturns: builder.query<
      IPaginatedData<ISaleReturn>,
      { invoiceId: number; page?: number }
    >({
      query: ({ invoiceId, page }) =>
        `/sale/sale-returns/invoice/${invoiceId}/?page=${
          page || 1
        }`,
      providesTags: (result, error, { invoiceId }) => [
        { type: 'InvoiceReturns', invoiceId },
      ],
    }),
  }),
})

export const {
  useGetSalesQuery,
  useCreateOrderMutation,
  useGetSingleSaleQuery,
  useDeleteSingleSaleorderMutation,
  useGetSaleSearchQuery,
  useGetSalesreturnQuery,
  useGetSinglereturnSaleQuery,
  useDeleteSingleSalereturnorderMutation,
  useCreateSalereturnMutation,
  useGetCreditSaleSearchQuery,
  useGetInvoiceQuery,
  useGetInvoiceReturnsQuery,
} = SalesApi
