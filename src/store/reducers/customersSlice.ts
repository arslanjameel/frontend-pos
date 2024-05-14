import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import fakeAddresses from 'src/@fake-db/addresses'
import {
  IComment,
  fakeComments,
  fakeDetailedTransactions,
  fakeOutstandingTransactions,
  fakeReferences,
  ICustomerNew,
  IOutstandingTransaction,
  fakeCustomersData,
  IDetailedTransaction,
  IStatement,
  fakeStatements,
  IReference,
  IOutstanding,
  fakeMonthlyOutstanding,
} from 'src/@fake-db/customers'
import { dateToString } from 'src/utils/dateUtils'
import { IAddress } from 'src/utils/types'

interface InitialState {
  customers: ICustomerNew[]
  outstandingTransactions: IOutstandingTransaction[]
  detailedTransactions: IDetailedTransaction[]
  comments: IComment[]
  statements: IStatement[]
  references: IReference[]
  addresses: IAddress[]
  outstanding: IOutstanding[]
}

const initialState: InitialState = {
  customers: [...fakeCustomersData],
  outstandingTransactions: [...fakeOutstandingTransactions],
  detailedTransactions: [...fakeDetailedTransactions],
  comments: [...fakeComments],
  outstanding: [...fakeMonthlyOutstanding],

  statements: [...fakeStatements],

  references: [...fakeReferences],
  addresses: [...fakeAddresses],
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    deleteCustomer: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        customers: state.customers.filter(
          customer => customer.id !== action.payload,
        ),
      }
    },

    addComment: (
      state,
      action: PayloadAction<IComment>,
    ) => {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      }
    },

    addAddress: (
      state,
      action: PayloadAction<IAddress>,
    ) => {
      let newAddresses: IAddress[] = [...state.addresses]

      if (action.payload.isDefaultBilling)
        newAddresses = newAddresses.map(addr =>
          !addr.isDefaultBilling
            ? addr
            : { ...addr, isDefaultBilling: false },
        )
      if (action.payload.isDefaultShipping)
        newAddresses = newAddresses.map(addr =>
          !addr.isDefaultShipping
            ? addr
            : { ...addr, isDefaultShipping: false },
        )

      return {
        ...state,
        addresses: [...newAddresses, action.payload],
      }
    },
    updateAddress: (
      state,
      action: PayloadAction<IAddress>,
    ) => {
      let newAddresses: IAddress[] = [...state.addresses]

      if (action.payload.isDefaultBilling)
        newAddresses = newAddresses.map(addr =>
          !addr.isDefaultBilling
            ? addr
            : { ...addr, isDefaultBilling: false },
        )
      if (action.payload.isDefaultShipping)
        newAddresses = newAddresses.map(addr =>
          !addr.isDefaultShipping
            ? addr
            : { ...addr, isDefaultShipping: false },
        )

      return {
        ...state,
        addresses: newAddresses.map(addr =>
          addr.id === action.payload.id
            ? action.payload
            : addr,
        ),
      }
    },
    deleteAddress: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        addresses: state.addresses.filter(
          addr => addr.id !== action.payload,
        ),
      }
    },

    addReference: (
      state,
      action: PayloadAction<IReference>,
    ) => {
      return {
        ...state,
        references: [...state.references, action.payload],
      }
    },
    verifyReference: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        references: state.references.map(ref =>
          ref.id === action.payload
            ? {
                ...ref,
                verificationStatus: 1,
                verifiedBy: 'John',
                verificationDate: dateToString(new Date()),
              }
            : ref,
        ),
      }
    },
    deleteReference: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        references: state.references.filter(
          ref => ref.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  deleteCustomer,
  addComment,
  addAddress,
  updateAddress,
  deleteAddress,
  addReference,
  verifyReference,
  deleteReference,
} = customersSlice.actions
export default customersSlice.reducer
