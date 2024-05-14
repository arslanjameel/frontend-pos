import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  ICreditNote,
  fakeCreditNotes,
} from 'src/@fake-db/creditNotes'

interface InitialState {
  creditNotes: ICreditNote[]
}

const initialState: InitialState = {
  creditNotes: [...fakeCreditNotes],
}

const creditNotesSlice = createSlice({
  name: 'creditNotes',
  initialState,
  reducers: {
    createCreditNote: (
      state,
      action: PayloadAction<ICreditNote>,
    ) => {
      return {
        ...state,
        creditNotes: [...state.creditNotes, action.payload],
      }
    },
    updateCreditNote: (
      state,
      action: PayloadAction<ICreditNote>,
    ) => {
      return {
        ...state,
        creditNotes: state.creditNotes.map(quote =>
          quote.id === action.payload.id
            ? action.payload
            : quote,
        ),
      }
    },
    deleteCreditNote: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        creditNotes: state.creditNotes.filter(
          product => product.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createCreditNote,
  updateCreditNote,
  deleteCreditNote,
} = creditNotesSlice.actions
export default creditNotesSlice.reducer
