import { createApi } from '@reduxjs/toolkit/query/react'

import {
  IBankAccount,
  IBusiness,
  IBusinessType,
} from 'src/models/IBusiness'
import { IOwner } from 'src/models/IOwner'
import {
  IStoreNew,
  IStore,
  IUpdateStore,
} from 'src/models/IStore'
import {
  IStoreManager,
  IUpdateUser,
  IUpdateUserPassCode,
  IUpdateUserStatus,
  IUserType,
  IUserWithID,
} from 'src/models/IUser'
import ICountry, { ICity } from 'src/models/shared/ICountry'
import {
  IPaginatedData,
  IPaginatedDataParams,
} from 'src/models/shared/IPaginatedData'
import { customBaseQuery } from '../utils/customBaseQuery'
import { getPaginationParams } from 'src/utils/apiUtils'

export const accountApi = createApi({
  reducerPath: 'accountApi',
  tagTypes: [
    'User',
    'UserStores',
    'StoreUsers',
    'Store',
    'Business',
    'BusinessType',
    'Owner',
    'Country',
    'City',
    'BankAccount',
    'StoreManager',
  ],
  baseQuery: customBaseQuery,
  endpoints: builder => ({
    getCountries: builder.query<
      ICountry[],
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/account/country/?page=${_params.page}`,
          method: 'GET',
        }
      },
      providesTags: ['Country'],
    }),
    getCities: builder.query<
      ICity[],
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/account/city/?page=${_params.page}`,
          method: 'GET',
        }
      },
      providesTags: ['City'],
    }),
    getSingleCity: builder.query<ICity, number>({
      query: cityId => {
        return {
          url: `/account/city/${cityId}`,
          method: 'GET',
        }
      },
      providesTags: (result, error, id) => [
        { type: 'City', id },
      ],
    }),

    /**
     *
     * Users
     *
     */
    getUsers: builder.query<
      IPaginatedData<IUserWithID>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/account/users/?page=${_params.page}`,
          method: 'GET',
        }
      },

      providesTags: ['User'],
    }),

    getSingleUser: builder.query<IUserWithID, number>({
      query: id => `/account/users/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'User', id },
      ],
    }),

    getUserStores: builder.query<
      IPaginatedData<IStore>,
      number
    >({
      query: userId => `/account/users/${userId}/stores/`,

      providesTags: (result, error, id) => [
        { type: 'UserStores', id },
      ],
    }),

    updateUser: builder.mutation<
      any,
      { id: number; body: IUpdateUser }
    >({
      query: ({ id, body }) => ({
        url: `/account/users/${id}/`,
        method: 'PUT',
        body,
      }),

      invalidatesTags: (result, error, id) => {
        console.log(result, error, id)

        return ['User']
      },
    }),

    updateUserPartial: builder.mutation<
      any,
      { id: number; body: Partial<IUpdateUser> }
    >({
      query: ({ id, body }) => ({
        url: `/account/users/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['User', 'UserStores', 'StoreUsers'],
    }),

    deleteUser: builder.mutation<any, number>({
      query: id => ({
        url: `/account/users/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['User'],
    }),

    getUserTypes: builder.query<
      IPaginatedData<IUserType>,
      void
    >({
      query: () => '/account/user-type/',
    }),

    updatePasswordPinCode: builder.mutation<
      any,
      IUpdateUserPassCode
    >({
      query: body => ({
        url: `/account/update-password-pincode/`,
        method: 'POST',
        body,
      }),
    }),

    updateUserStatus: builder.mutation<
      any,
      IUpdateUserStatus
    >({
      query: body => ({
        url: `/account/update-status/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User' }],
    }),

    /**
     *
     * Stores
     */
    getStores: builder.query<
      IPaginatedData<IStore>,
      IPaginatedDataParams | void
    >({
      query: params => {
        const _params = getPaginationParams(params)

        return {
          url: `/account/stores/?page=${_params.page}`,
          method: 'GET',
        }
      },
      providesTags: ['Store'],
    }),
    getSingleStore: builder.query<IStore, number>({
      query: id => `/account/stores/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Store', id },
      ],
    }),
    getSingleStoreUsers: builder.query<
      IPaginatedData<IStore>,
      number
    >({
      query: id => `/account/stores/${id}/users/`,
      providesTags: (result, error, id) => [
        { type: 'StoreUsers', id },
      ],
    }),
    createStore: builder.mutation<IStore, IStoreNew>({
      query: body => ({
        url: `/account/stores/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation<
      IStore,
      { id: number; body: IUpdateStore }
    >({
      query: ({ id, body }) => ({
        url: `/account/stores/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Store'],
    }),
    deleteStore: builder.mutation<any, number>({
      query: id => ({
        url: `/account/stores/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Store'],
    }),

    /**
     *
     * Business
     */
    getBusinesses: builder.query<
      IPaginatedData<IBusiness>,
      void
    >({
      query: () => '/account/business/',
      providesTags: ['Business'],
    }),
    getSingleBusiness: builder.query<IBusiness, number>({
      query: id => `/account/business/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Business', id },
      ],
    }),

    getBusinessBankAccounts: builder.query<
      IPaginatedData<IBankAccount>,
      number
    >({
      query: id => `/account/business/bank-account/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'BankAccount', id },
      ],
    }),

    /**
     *
     * Business Type
     */
    getBusinessTypes: builder.query<
      IPaginatedData<IBusinessType>,
      void
    >({
      query: () => '/account/business-type/',
      providesTags: ['BusinessType'],
    }),
    getSingleBusinessType: builder.query<
      IBusinessType,
      number
    >({
      query: id => `/account/business-type/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'BusinessType', id },
      ],
    }),

    /**
     *
     * Owner
     */
    getOwners: builder.query<IPaginatedData<IOwner>, void>({
      query: () => '/account/owner/',
      providesTags: ['Owner'],
    }),
    getSingleOwner: builder.query<IBusinessType, number>({
      query: id => `/account/owner/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Owner', id },
      ],
    }),

    /**
     *
     *
     * Manager Actions
     *
     */
    validateManagerPin: builder.mutation<
      { [key: string]: string },
      { manager_id: number; pin_code: string }
    >({
      query: body => ({
        url: `/account/validate-manager-pin/`,
        method: 'POST',
        body,
      }),
    }),

    getStoreManagers: builder.query<
      IStoreManager[],
      number
    >({
      query: store_id => `/account/managers/${store_id}/`,
      providesTags: (result, error, id) => [
        { type: 'StoreManager', id },
      ],
    }),
  }),
})

export const {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useGetSingleCityQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useGetUserStoresQuery,

  useUpdateUserMutation,
  useUpdateUserPartialMutation,
  useDeleteUserMutation,

  useGetUserTypesQuery,

  useUpdatePasswordPinCodeMutation,
  useUpdateUserStatusMutation,

  useGetStoresQuery,
  useGetSingleStoreQuery,
  useGetSingleStoreUsersQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,

  useGetBusinessesQuery,
  useGetSingleBusinessQuery,
  useGetBusinessBankAccountsQuery,

  useGetBusinessTypesQuery,
  useGetSingleBusinessTypeQuery,

  useGetOwnersQuery,
  useGetSingleOwnerQuery,

  useValidateManagerPinMutation,
  useGetStoreManagersQuery,
} = accountApi
