import { createApi } from '@reduxjs/toolkit/query/react'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'

import { customBaseQuery } from '../utils/customBaseQuery'
import {
  ISaleReturn,
  ISaleReturnNew,
  ISaleReturnUpdate,
} from 'src/models/ISaleReturn'

export const returnsApi = createApi({
  reducerPath: 'returnsApi',
  tagTypes: [
    'SaleReturn',
    'InvoiceSaleReturns',
    'OrderSaleReturns',
  ],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getInvoiceSaleReturns: builder.query<
      IPaginatedData<ISaleReturn>,
      number
    >({
      query: invoiceId => {
        return {
          url: `/sale/sale-returns/invoice/${invoiceId}/`,
          method: 'GET',
        }
      },

      providesTags: (results, errors, id) => [
        { type: 'InvoiceSaleReturns', id },
      ],
    }),
    getOrderSaleReturns: builder.query<
      IPaginatedData<ISaleReturn>,
      number
    >({
      query: invoiceId => {
        return {
          url: `/sale/sale-returns/order/${invoiceId}/`,
          method: 'GET',
        }
      },

      providesTags: (results, errors, id) => [
        { type: 'OrderSaleReturns', id },
      ],
    }),
    getSaleReturn: builder.query<
      IPaginatedData<ISaleReturn>,
      void
    >({
      query: () => `/sale/sale-returns/`,
      providesTags: () => ['SaleReturn'],

      //   providesTags: ['InvoiceSaleReturns'],
    }),
    createSaleReturn: builder.mutation<
      ISaleReturn,
      ISaleReturnNew
    >({
      query: body => ({
        url: `/sale/sale-returns/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SaleReturn'],
    }),

    getSingleMarkeComplete: builder.query<
      ISaleReturn,
      number
    >({
      query: id => `/sale/sale-returns/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'SaleReturn', id },
      ],
    }),

    updateSaleReturn: builder.mutation<
      ISaleReturn,
      { id: number; body: ISaleReturnUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/sale/sale-returns/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: (results, errors, params) => [
        'SaleReturn',
        { type: 'SaleReturn', id: params.id },
      ],
    }),
    deleteSaleReturn: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-returns/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: (results, errors, id) => [
        'SaleReturn',
        { type: 'SaleReturn', id },
      ],
    }),
  }),
})

export const {} = returnsApi
