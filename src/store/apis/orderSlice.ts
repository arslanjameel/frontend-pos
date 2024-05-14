import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import { IQuote } from 'src/models/IQuote'
import {
  ISaleInvoice,
  ISaleInvoiceUpdate,
} from 'src/models/ISaleInvoice'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  tagTypes: ['Search'],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    createOrder: builder.mutation<IQuote, any>({
      query: body => ({
        url: `/sale/sale-order/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Search'],
    }),

    deleteOrder: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-order/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Search'],
    }),

    getSingleOrder: builder.query<any, number>({
      query: id => `/sale/sale-order/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Search', id },
      ],
    }),

    updateOrder: builder.mutation<
      ISaleInvoice,
      { id: number; body: ISaleInvoiceUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/sale/sale-order/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: ['Search'],
    }),

    searchOrder: builder.query<
      IPaginatedData<ISaleInvoice>,
      {
        search: string
        start: string
        end: string
        page: number
        store: number
      }
    >({
      query: query =>
        `/sale/order/search/?search_term=${query.search}&start_date=${query.start}&end_date=${query.end}&page=${query.page}&store=${query.store}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useSearchOrderQuery,
} = ordersApi
