import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import { IQuote, fakeQuotes } from 'src/@fake-db/quotes'

interface InitialState {
  quotes: IQuote[]
}

const initialState: InitialState = {
  quotes: [...fakeQuotes],
}

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    createQuote: (state, action: PayloadAction<IQuote>) => {
      return {
        ...state,
        quotes: [...state.quotes, action.payload],
      }
    },
    updateQuote: (state, action: PayloadAction<IQuote>) => {
      return {
        ...state,
        quotes: state.quotes.map(quote =>
          quote.id === action.payload.id
            ? action.payload
            : quote,
        ),
      }
    },
    deleteQuote: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        quotes: state.quotes.filter(
          product => product.id !== action.payload,
        ),
      }
    },
  },
})

export const { createQuote, updateQuote, deleteQuote } =
  quotesSlice.actions
export default quotesSlice.reducer
