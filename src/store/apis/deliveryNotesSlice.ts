import { createApi } from '@reduxjs/toolkit/query/react'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'

import { customBaseQuery } from '../utils/customBaseQuery'

import {
  ISaleDeliveryNote,
  ISaleDeliveryNoteNew,
  ISaleDeliveryNoteUpdate,
} from 'src/models/ISaleDeliveryNote'

export const deliveryNoteApi = createApi({
  reducerPath: 'deliveryNoteApi',
  tagTypes: [
    'InvoiceDeliveryNotes',
    'OrderDeliveryNotes',
    'AllDeliveryNotes',
  ],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getInvoiceDeliveryNotes: builder.query<
      ISaleDeliveryNote[],
      number
    >({
      query: invoiceId => {
        return {
          url: `/sale/delivery-note/search/?sale_invoice=${invoiceId}`,
          method: 'GET',
        }
      },

      providesTags: (results, errors, id) => [
        { type: 'InvoiceDeliveryNotes', id },
      ],
    }),
    getOrderDeliveryNotes: builder.query<
      ISaleDeliveryNote[],
      number
    >({
      query: orderId => {
        return {
          url: `/sale/delivery-note/search/?sale_order=${orderId}`,
          method: 'GET',
        }
      },

      providesTags: (results, errors, id) => [
        { type: 'OrderDeliveryNotes', id },
      ],
    }),
    getDeliveryNotes: builder.query<
      IPaginatedData<ISaleDeliveryNote>,
      void
    >({
      query: () => `/sale/sale-delivery-notes/`,
      providesTags: () => ['AllDeliveryNotes'],

      //   providesTags: ['InvoiceDeliveryNotes'],
    }),
    createDeliveryNote: builder.mutation<
      ISaleDeliveryNote,
      ISaleDeliveryNoteNew
    >({
      query: body => ({
        url: `/sale/sale-delivery-notes/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: results => [
        'AllDeliveryNotes',
        {
          type: 'InvoiceDeliveryNotes',
          id: results?.sale_invoice,
        },
        {
          type: 'OrderDeliveryNotes',
          id: results?.sale_order || undefined,
        },
      ],
    }),

    getSingleDeliveryNote: builder.query<
      ISaleDeliveryNote,
      number
    >({
      query: id => `/sale/sale-delivery-notes/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'AllDeliveryNotes', id },
      ],
    }),

    updateDeliveryNote: builder.mutation<
      ISaleDeliveryNote,
      { id: number; body: ISaleDeliveryNoteUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/sale/sale-delivery-notes/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: (results, errors, params) => [
        'AllDeliveryNotes',
        { type: 'InvoiceDeliveryNotes', id: params.id },
      ],
    }),
    deleteDeliveryNote: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-delivery-notes/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: (results, errors, id) => [
        'AllDeliveryNotes',
        { type: 'InvoiceDeliveryNotes', id },
      ],
    }),
  }),
})

export const {
  useGetInvoiceDeliveryNotesQuery,
  useGetOrderDeliveryNotesQuery,
  useGetDeliveryNotesQuery,
  useCreateDeliveryNoteMutation,
  useUpdateDeliveryNoteMutation,
  useDeleteDeliveryNoteMutation,
} = deliveryNoteApi
