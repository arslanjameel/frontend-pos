import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  ICategory,
  fakeCategoriesData,
} from 'src/@fake-db/categories'

interface InitialState {
  categories: ICategory[]
}

const initialState: InitialState = {
  categories: [...fakeCategoriesData],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    createCategory: (
      state,
      action: PayloadAction<ICategory>,
    ) => {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }
    },
    updateCategory: (
      state,
      action: PayloadAction<ICategory>,
    ) => {
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? action.payload
            : category,
        ),
      }
    },
    deleteCategory: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createCategory,
  updateCategory,
  deleteCategory,
} = categoriesSlice.actions
export default categoriesSlice.reducer
