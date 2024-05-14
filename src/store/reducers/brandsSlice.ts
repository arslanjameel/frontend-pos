import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import { IBrand, fakeBrandsData } from 'src/@fake-db/brands'

interface InitialState {
  brands: IBrand[]
}

const initialState: InitialState = {
  brands: [...fakeBrandsData],
}

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    createBrand: (state, action: PayloadAction<IBrand>) => {
      return {
        ...state,
        brands: [...state.brands, action.payload],
      }
    },
    updateBrand: (state, action: PayloadAction<IBrand>) => {
      return {
        ...state,
        brands: state.brands.map(brand =>
          brand.id === action.payload.id
            ? action.payload
            : brand,
        ),
      }
    },
    deleteBrand: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        brands: state.brands.filter(
          brand => brand.id !== action.payload,
        ),
      }
    },
  },
})

export const { createBrand, updateBrand, deleteBrand } =
  brandsSlice.actions
export default brandsSlice.reducer
