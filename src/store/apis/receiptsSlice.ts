import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import { IReceipt } from 'src/models/IReceipts'

export const receiptsApi = createApi({
  reducerPath: 'receiptsApi',
  tagTypes: [
    'Receipts',
    'Search',
    'Invoices',
    'InvoiceReceipts',
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    /*
     *
     * Receipts
     *
     */
    getReceipts: builder.query<
      IPaginatedData<IReceipt>,
      void
    >({
      query: () => '/sale/sale-receipts/',
      providesTags: ['Receipts'],
    }),
    createReceipt: builder.mutation<IReceipt, any>({
      query: body => ({
        url: `/sale/sale-receipts/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Receipts', 'Search'],
    }),
    getSingleReceipt: builder.query<IReceipt, number>({
      query: id => `/sale/sale-receipts/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Receipts', id },
      ],
    }),
    deleteSingleReceipt: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-receipts/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Receipts'],
    }),

    /**
     *
     * User Transactions
     *
     * */
    getSingleUserTransaction: builder.query<any, number>({
      query: id =>
        `/customer/customer-pending-invoices/?customer_id=${id}`,
      providesTags: (result, error, id) => [
        { type: 'Invoices', id },
      ],
    }),

    /**
     *
     * Invoice Receipts
     *
     * */
    getInvoiceReceipts: builder.query<
      IPaginatedData<IReceipt>,
      number
    >({
      query: sale_invoice_id =>
        `/sale/sale-receipt/invoice/${sale_invoice_id}/`,
      providesTags: (result, error, id) => [
        { type: 'InvoiceReceipts', id },
      ],
    }),

    getReceiptSearch: builder.query<
      IPaginatedData<IReceipt[]>,
      {
        search: string
        start: string
        end: string
        page: number
        store: number
      }
    >({
      query: query =>
        `/sale/receipt/search/?search_term=${query.search}&start_date=${query.start}&end_date=${query.end}&page=${query.page}&store=${query.store}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),
  }),
})

export const {
  useGetReceiptsQuery,
  useCreateReceiptMutation,
  useGetSingleReceiptQuery,
  useDeleteSingleReceiptMutation,
  useGetSingleUserTransactionQuery,
  useGetInvoiceReceiptsQuery,
  useGetReceiptSearchQuery,
} = receiptsApi
