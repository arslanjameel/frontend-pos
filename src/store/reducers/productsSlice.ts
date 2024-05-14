import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  IProduct,
  fakeProducts,
  IRawProduct,
  fakeRawProducts,
} from 'src/@fake-db/products'

interface InitialState {
  products: IProduct[]
  rawProducts: IRawProduct[]
  appDiscount: number
}

const initialState: InitialState = {
  products: [...fakeProducts],
  rawProducts: [...fakeRawProducts],
  appDiscount: 1,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    createProduct: (
      state,
      action: PayloadAction<IProduct>,
    ) => {
      return {
        ...state,
        products: [...state.products, action.payload],
      }
    },
    updateProduct: (
      state,
      action: PayloadAction<IProduct>,
    ) => {
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? action.payload
            : product,
        ),
      }
    },
    deleteProduct: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        products: state.products.filter(
          product => product.id !== action.payload,
        ),
      }
    },

    createRawProduct: (
      state,
      action: PayloadAction<IRawProduct>,
    ) => {
      return {
        ...state,
        rawProducts: [...state.rawProducts, action.payload],
      }
    },
    deleteRawProduct: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        rawProducts: state.rawProducts.filter(
          product => product.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createProduct,
  updateProduct,
  deleteProduct,
  createRawProduct,
  deleteRawProduct,
} = productsSlice.actions
export default productsSlice.reducer
