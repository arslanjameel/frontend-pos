import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react'
import { IUser, IUserRegister } from 'src/models/IUser'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

const getUrl = (path = '/') => `${BASE_URL}${path}`

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
  }),
  endpoints: builder => ({
    registerUser: builder.mutation<IUser, IUserRegister>({
      query: body => ({
        url: '/account/register/',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useRegisterUserMutation } = authApi
