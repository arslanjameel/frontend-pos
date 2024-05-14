import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import { IStore } from 'src/models/IStore'
import { DEFAULT_STORE } from 'src/utils/globalConstants'

interface InitialState {
  storeModal: boolean
  switchUserModal: boolean
  selectedStore: null | number
  store: IStore
}

const initialState: InitialState = {
  storeModal: true,
  switchUserModal: false,
  selectedStore: null,
  store: DEFAULT_STORE,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openStoreModal: state => {
      return { ...state, storeModal: true }
    },
    closeStoreModal: state => {
      return { ...state, storeModal: false }
    },
    openSwitchUserModal: state => {
      return { ...state, switchUserModal: true }
    },
    closeSwitchUserModal: state => {
      return { ...state, switchUserModal: false }
    },
    selectStore: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        selectedStore: action.payload,
        storeModal: false,
      }
    },
    activeStore: (state, action: PayloadAction<IStore>) => {
      return {
        ...state,
        store: action.payload,
        storeModal: false,
      }
    },
  },
})

export const {
  openStoreModal,
  closeStoreModal,
  selectStore,
  activeStore,
  openSwitchUserModal,
  closeSwitchUserModal,
} = appSlice.actions
export default appSlice.reducer
