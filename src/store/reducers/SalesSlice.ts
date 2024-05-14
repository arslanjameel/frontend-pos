import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import { IQuote, fakeQuotes } from 'src/@fake-db/quotes'

interface InitialState {
  Sales: IQuote[]
}

const initialState: InitialState = {
  Sales: [...fakeQuotes],
}

const SalesSlice = createSlice({
  name: 'Sales',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<IQuote>) => {
      return {
        ...state,
        Sales: [...state.Sales, action.payload],
      }
    },
    updateSale: (state, action: PayloadAction<IQuote>) => {
      return {
        ...state,
        Sales: state.Sales.map(quote =>
          quote.id === action.payload.id
            ? action.payload
            : quote,
        ),
      }
    },
    deleteSale: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        Sales: state.Sales.filter(
          product => product.id !== action.payload,
        ),
      }
    },
  },
})

export const { createOrder, updateSale, deleteSale } =
  SalesSlice.actions
export default SalesSlice.reducer
