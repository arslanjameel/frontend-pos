import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'

import fakeStores from 'src/@fake-db/stores'
import { IUser, fakeUsers } from 'src/@fake-db/users'

export interface IStoreListItem {
  id: number
  last_name: string
  first_name: string
  email: string
  type: string
  mobile: string
  address: string
  accNo: string
  img: string

  storeName?: string
  storeType?: string
  storePhone?: string
  bankAccName?: string
  sortCode?: string
  storeEmail?: string
  password?: string
  postcode?: string
  city?: number
  country?: number
}

export interface IWarehouse {
  id: string
  floor: string
  floorName?: string
  sections: string[]
}

export interface IFloor {
  id: string
  floorName: string
  sections: number[]
}

interface InitialState {
  stores: IStoreListItem[]
  storeTitles: string[]
  warehouses: IWarehouse[]
  storesAccess: IUser[]
}

const initialState: InitialState = {
  stores: [...fakeStores],
  storeTitles: [
    'Best Buy',
    'Premier',
    'Sharjah Traders',
    'Nexus Trade',
    'Premier2',
    'Best Buy2',
    'Premier3',
    'Sharjah Traders2',
  ],
  warehouses: [
    {
      id: '1212',
      floor: 'BB First Floor',
      sections: ['SectionA', 'SectionB'],
    },
    {
      id: '1213',
      floor: 'BB First Floor',
      sections: ['SectionA', 'SectionB'],
    },
  ],
  storesAccess: [fakeUsers[0]],
}

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    createStore: (
      state,
      action: PayloadAction<IStoreListItem>,
    ) => {
      return {
        ...state,
        stores: [...state.stores, action.payload],
      }
    },
    updateStore: (
      state,
      action: PayloadAction<IStoreListItem>,
    ) => {
      return {
        ...state,
        stores: state.stores.map(store =>
          store.id === action.payload.id
            ? action.payload
            : store,
        ),
      }
    },
    deleteStore: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        stores: state.stores.filter(
          store => store.id !== action.payload,
        ),
      }
    },

    createWarehouse: (
      state,
      action: PayloadAction<IWarehouse>,
    ) => {
      return {
        ...state,
        warehouses: [...state.warehouses, action.payload],
      }
    },
    updateWarehouse: (
      state,
      action: PayloadAction<IWarehouse>,
    ) => {
      return {
        ...state,
        warehouses: state.warehouses.map(store =>
          store.id === action.payload.id
            ? action.payload
            : store,
        ),
      }
    },
    deleteWarehouse: (
      state,
      action: PayloadAction<string>,
    ) => {
      return {
        ...state,
        warehouses: state.warehouses.filter(
          store => store.id !== action.payload,
        ),
      }
    },
    updateUserAccess: (
      state,
      action: PayloadAction<IUser[]>,
    ) => {
      return {
        ...state,
        storesAccess: action.payload,
      }
    },

    // createUserAccess: (state, action: PayloadAction<IWarehouse>) => {
    //   return {
    //     ...state,
    //     warehouses: [...state.warehouses, action.payload]
    //   }
    // },
    // updateUserAccess: (state, action: PayloadAction<IWarehouse>) => {
    //   return {
    //     ...state,
    //     warehouses: state.warehouses.map(store => (store.id === action.payload.id ? action.payload : store))
    //   }
    // },
    deleteUserAccess: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        storesAccess: state.storesAccess.filter(
          access => access.id !== action.payload,
        ),
      }
    },
  },
})

export const {
  createStore,
  updateStore,
  deleteStore,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  updateUserAccess,
  deleteUserAccess,
} = storesSlice.actions
export default storesSlice.reducer
