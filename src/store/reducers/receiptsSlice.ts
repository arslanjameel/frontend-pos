import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  IReceipt,
  fakeReceipts,
} from 'src/@fake-db/receipts'

interface InitialState {
  receipts: IReceipt[]
}

const initialState: InitialState = {
  receipts: [...fakeReceipts],
}

const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    createReceipt: (
      state,
      action: PayloadAction<IReceipt>,
    ) => {
      return {
        ...state,
        receipts: [...state.receipts, action.payload],
      }
    },
    updateReceipt: (
      state,
      action: PayloadAction<IReceipt>,
    ) => {
      return {
        ...state,
        receipts: state.receipts.map(receipt =>
          receipt.id === action.payload.id
            ? action.payload
            : receipt,
        ),
      }
    },
    deleteReceipt: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        receipts: state.receipts.filter(
          receipt => receipt.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createReceipt,
  updateReceipt,
  deleteReceipt,
} = receiptsSlice.actions
export default receiptsSlice.reducer
