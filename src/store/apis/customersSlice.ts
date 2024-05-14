import { createApi } from '@reduxjs/toolkit/query/react'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import {
  IAddress,
  IAddressNew,
  IAddressUpdate,
} from 'src/models/IAddress'
import {
  IComment,
  ICommentNew,
  ICommentUpdate,
} from 'src/models/IComment'
import {
  ICustomer,
  ICustomerNew,
  ICustomerUpdate,
} from 'src/models/ICustomer'
import {
  IReference,
  IReferenceNew,
  IReferenceStatus,
  IReferenceStatusNew,
  IReferenceStatusUpdate,
  IReferenceUpdate,
} from 'src/models/IReference'
import { customBaseQuery } from '../utils/customBaseQuery'

export const customersApi = createApi({
  reducerPath: 'customersApi',
  tagTypes: [
    'Address',
    'CustomerAddresses',
    'Comment',
    'Customer',
    'Reference',
    'ReferenceStatus',
    'Receipts',
  ],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    /**
     *
     * Addresses
     *
     */
    getCustomerAddresses: builder.query<
      IPaginatedData<IAddress>,
      void
    >({
      query: () => '/customer/addresses/',
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation<IAddress, IAddressNew>({
      query: body => ({
        url: `/customer/addresses/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'Address',
        { type: 'CustomerAddresses' },
      ],
    }),
    getSingleAddress: builder.query<IAddress, number>({
      query: id => `/customer/addresses/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Address', id },
      ],
    }),
    updateAddress: builder.mutation<
      IAddress,
      { id: number; body: IAddressUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/customer/addresses/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: [
        'Address',
        { type: 'Customer' },
        { type: 'CustomerAddresses' },
      ],
    }),
    deleteAddress: builder.mutation<any, number>({
      query: id => ({
        url: `/customer/addresses/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: [
        'Address',
        { type: 'CustomerAddresses' },
      ],
    }),

    /**
     *
     * Comments
     *
     */
    getComments: builder.query<
      IPaginatedData<IComment>,
      void
    >({
      query: () => '/customer/comments/',
      providesTags: ['Comment'],
    }),
    createComment: builder.mutation<IComment, ICommentNew>({
      query: body => ({
        url: `/customer/comments/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    getSingleComment: builder.query<IComment, number>({
      query: id => `/customer/comments/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Comment', id },
      ],
    }),
    updateComment: builder.mutation<
      IComment,
      { id: number; body: ICommentUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/customer/comments/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation<any, number>({
      query: id => ({
        url: `/customer/comments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),

    /**
     *
     *
     * Customers
     *
     */
    searchCustomers: builder.query<
      IPaginatedData<ICustomer>,
      string
    >({
      query: searchString => ({
        url: `/customer/search/?q=${searchString}`,
        method: 'GET',
      }),
      providesTags: [], //TODO: update in future
    }),

    getCustomers: builder.query<
      IPaginatedData<ICustomer>,
      void
    >({
      query: () => '/customer/customers/',
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<
      ICustomer,
      ICustomerNew
    >({
      query: body => ({
        url: `/customer/customers/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    getSingleCustomer: builder.query<ICustomer, number>({
      query: id => `/customer/customers/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Customer', id },
      ],
    }),
    getSingleCustomerAddresses: builder.query<
      IPaginatedData<IAddress>,
      number
    >({
      query: id => `/customer/customers/${id}/addresses/`,
      providesTags: (result, error, id) => [
        { type: 'CustomerAddresses', id },
      ],
    }),
    updateCustomer: builder.mutation<
      ICustomer,
      { id: number; body: ICustomerUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/customer/customers/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: ['Customer'],
    }),
    deleteCustomer: builder.mutation<any, number>({
      query: id => ({
        url: `/customer/customers/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Customer'],
    }),

    /**
     *
     *
     * References
     *
     */
    getReferences: builder.query<
      IPaginatedData<IReference>,
      void
    >({
      query: () => '/customer/references/',
      providesTags: ['Reference'],
    }),
    createReference: builder.mutation<
      IReference,
      IReferenceNew
    >({
      query: body => ({
        url: `/customer/references/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reference'],
    }),
    getSingleReference: builder.query<IReference, number>({
      query: id => `/customer/references/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Reference', id },
      ],
    }),
    updateReference: builder.mutation<
      IReference,
      { id: number; body: IReferenceUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/customer/references/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Reference'],
    }),
    deleteReference: builder.mutation<any, number>({
      query: id => ({
        url: `/customer/references/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Reference'],
    }),

    /**
     *
     *
     * Reference Status
     *
     */
    getReferenceStatuses: builder.query<
      IPaginatedData<IReferenceStatus>,
      void
    >({
      query: () => '/customer/reference-statuses/',
      providesTags: ['ReferenceStatus'],
    }),
    createReferenceStatus: builder.mutation<
      IReferenceStatus,
      IReferenceStatusNew
    >({
      query: body => ({
        url: `/customer/reference-statuses/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ReferenceStatus'],
    }),
    getSingleReferenceStatus: builder.query<
      IReferenceStatus,
      number
    >({
      query: id => `/customer/reference-statuses/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'ReferenceStatus', id },
      ],
    }),
    updateReferenceStatus: builder.mutation<
      IReferenceStatus,
      { id: number; body: IReferenceStatusUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/customer/reference-statuses/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['ReferenceStatus'],
    }),
    deleteReferenceStatus: builder.mutation<any, number>({
      query: id => ({
        url: `/customer/reference-statuses/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['ReferenceStatus'],
    }),

    /**
     *
     * Transactions
     *
     *
     */

    // IPaginatedData<ISaleInvoice>,

    getCustomerTransactions: builder.query<
      { transactions: any[] },
      {
        customer_id: number
        searchTerm?: string
        page: number
        startDate?: string
        endDate?: string
        status?: string
      }
    >({
      query: params => {
        let queryString = `/customer/customer-transactions/?`

        queryString += `page=${params.page}&customer_id=${params.customer_id}&search_term=${params.searchTerm}`

        if (params.startDate) {
          queryString += `&start_date=${params.startDate}`
        }
        if (params.endDate) {
          queryString += `&end_date=${params.endDate}`
        }
        if (params.status) {
          queryString += `&status=${params.status}`
        }

        return {
          url: queryString,
          method: 'GET',
        }
      },
    }),

    getCustomerPendingInvoices: builder.query<
      IPaginatedData<any>,
      {
        customer_id: number
        searchTerm?: string
        page: number
        startDate?: string
        endDate?: string
        status?: string
      }
    >({
      query: params => {
        let queryString = `/customer/customer-pending-invoices/?`

        queryString += `page=${params.page}&customer_id=${params.customer_id}&search_term=${params.searchTerm}`

        if (params.startDate) {
          queryString += `&start_date=${params.startDate}`
        }
        if (params.endDate) {
          queryString += `&end_date=${params.endDate}`
        }
        if (params.status) {
          queryString += `&status=${params.status}`
        }

        return {
          url: queryString,
          method: 'GET',
        }
      },
      providesTags: (result, error, params) => [
        { type: 'Receipts', params },
      ],
    }),
  }),
})

export const {
  useGetCustomerAddressesQuery,
  useCreateAddressMutation,
  useGetSingleAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,

  useGetCommentsQuery,
  useCreateCommentMutation,
  useGetSingleCommentQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,

  useSearchCustomersQuery,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetSingleCustomerQuery,
  useLazyGetSingleCustomerQuery,
  useGetSingleCustomerAddressesQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  useGetReferencesQuery,
  useCreateReferenceMutation,
  useGetSingleReferenceQuery,
  useUpdateReferenceMutation,
  useDeleteReferenceMutation,

  useGetReferenceStatusesQuery,
  useCreateReferenceStatusMutation,
  useGetSingleReferenceStatusQuery,
  useUpdateReferenceStatusMutation,
  useDeleteReferenceStatusMutation,

  useGetCustomerTransactionsQuery,
  useGetCustomerPendingInvoicesQuery,
} = customersApi
