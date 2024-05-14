import { createApi } from '@reduxjs/toolkit/query/react'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'

import { customBaseQuery } from '../utils/customBaseQuery'
import {
  IMarkCompleted,
  IMarkCompletedNew,
  IMarkCompletedUpdate,
} from 'src/models/IMarkCompleted'

export const markCompletedApi = createApi({
  reducerPath: 'markCompletedApi',
  tagTypes: ['MarkCompleted'],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getMarkCompletedNew: builder.query<
      IMarkCompleted[],
      {
        sale_invoice_id: number | null
        sale_order_id: number | null
      }
    >({
      query: ({ sale_order_id, sale_invoice_id }) => {
        let url = `/sale/mark-completed-records/`

        if (sale_invoice_id) {
          url += `?sale_invoice_id=${sale_invoice_id}`
        }
        if (sale_order_id) {
          url += `?sale_order_id=${sale_order_id}`
        }

        return { url }
      },
      providesTags: () => ['MarkCompleted'],

      //   providesTags: ['InvoiceMarkCompleteds'],
    }),
    getMarkCompleted: builder.query<
      IPaginatedData<IMarkCompleted>,
      {
        page: number
        store?: number
      }
    >({
      query: ({ page }) =>
        `/sale/mark_completed/?page=${page}`,
      providesTags: () => ['MarkCompleted'],

      //   providesTags: ['InvoiceMarkCompleteds'],
    }),
    createMarkCompleted: builder.mutation<
      IMarkCompleted,
      IMarkCompletedNew
    >({
      query: body => ({
        url: `/sale/mark_completed/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MarkCompleted'],
    }),

    getSingleMarkeComplete: builder.query<
      IMarkCompleted,
      number
    >({
      query: id => `/sale/mark_completed/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'MarkCompleted', id },
      ],
    }),

    updateMarkCompleted: builder.mutation<
      IMarkCompleted,
      { id: number; body: IMarkCompletedUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/sale/mark_completed/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: (results, errors, params) => [
        'MarkCompleted',
        { type: 'MarkCompleted', id: params.id },
      ],
    }),

    deleteMarkCompleted: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/mark_completed/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: (results, errors, id) => [
        'MarkCompleted',
        { type: 'MarkCompleted', id },
      ],
    }),
  }),
})

export const {
  useGetMarkCompletedNewQuery,
  useCreateMarkCompletedMutation,
  useDeleteMarkCompletedMutation,
  useGetMarkCompletedQuery,
  useGetSingleMarkeCompleteQuery,
  useUpdateMarkCompletedMutation,
} = markCompletedApi
