import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  IOutstanding,
  fakeMonthlyOutstanding,
  fakeSuppliersData,
  ISupplierNew,
} from 'src/@fake-db/suppliers'

interface InitialState {
  suppliers: ISupplierNew[]
  outstanding: IOutstanding[]
}

const initialState: InitialState = {
  suppliers: [...fakeSuppliersData],
  outstanding: [...fakeMonthlyOutstanding],
}

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    createSupplier: (
      state,
      action: PayloadAction<ISupplierNew>,
    ) => {
      return {
        ...state,
        suppliers: [...state.suppliers, action.payload],
      }
    },
    updateSupplier: (
      state,
      action: PayloadAction<ISupplierNew>,
    ) => {
      return {
        ...state,
        suppliers: state.suppliers.map(supplier =>
          supplier.id === action.payload.id
            ? action.payload
            : supplier,
        ),
      }
    },
    deleteSupplier: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        suppliers: state.suppliers.filter(
          supplier => supplier.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = suppliersSlice.actions
export default suppliersSlice.reducer
