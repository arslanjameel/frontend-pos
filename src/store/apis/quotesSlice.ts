import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import { IQuote } from 'src/models/IQuote'
import { IUser } from 'src/models/IUser'

export const quotesApi = createApi({
  reducerPath: 'quotesApi',
  tagTypes: ['Quotes', 'Search'],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    /*
     *
     * Quotes
     *
     */
    getQuotes: builder.query<IPaginatedData<IQuote>, void>({
      query: () => '/sale/sale-quotes/',
      providesTags: ['Quotes'],
    }),
    createQuotes: builder.mutation<IQuote, any>({
      query: body => ({
        url: `/sale/sale-quotes/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Search'],
    }),
    getSingleQuote: builder.query<any, number>({
      query: id => `/sale/sale-quotes/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Quotes', id },
      ],
    }),
    deleteSingleQuote: builder.mutation<any, number>({
      query: id => ({
        url: `/sale/sale-quotes/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Search'],
    }),

    /**
     *
     * Users
     *
     */
    getUsersWithQuotes: builder.query<IUser[], void>({
      query: () => '/sale/users-with-sale-quotes/',
      providesTags: ['Quotes'],
    }),

    /**
     *
     * Search
     *
     */
    getQuoteSearch: builder.query<
      IPaginatedData<IQuote[]>,
      {
        search: string
        start: string
        end: string
        user: string
        page: number
        store: number
      }
    >({
      query: query =>
        `/sale/quotes/search/?search_term=${query.search}&start_date=${query.start}&end_date=${query.end}&user_id=${query.user}&page=${query.page}&store=${query.store}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),
  }),
})

export const {
  useGetQuotesQuery,
  useCreateQuotesMutation,
  useGetSingleQuoteQuery,
  useDeleteSingleQuoteMutation,
  useGetUsersWithQuotesQuery,
  useGetQuoteSearchQuery,
} = quotesApi
