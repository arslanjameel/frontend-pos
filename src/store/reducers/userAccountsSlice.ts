import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { fakeUsers, IUser } from 'src/@fake-db/users'
import IWorkingHr from 'src/models/shared/IWorkingHr'

interface Step1 {
  first_name?: string
  last_name?: string
  password?: string
  verifyPassword?: string
  pin_code?: string
  verifyPinCode?: string
  email?: string
  mobile?: string
  address?: string
  city?: number
  country?: number
  postal_code?: string
}

// interface IWorkingHr {
//   dayOfWeek: string
//   status: boolean
//   startTime: string
//   endTime: string
// }

interface Step3 {
  role: number
  stores: number[]
}

interface InitialState {
  userAccounts: IUser[]
  createUserSteps: {
    step1: Step1
    step2: IWorkingHr[]
    step3: Step3
  }
}

const createUserSteps = {
  step1: {},
  step2: [],
  step3: { role: 0, stores: [] },
}

const initialState: InitialState = {
  userAccounts: [...fakeUsers],
  createUserSteps: createUserSteps,
}

const userAccounts = createSlice({
  name: 'userAccounts',
  initialState,
  reducers: {
    createUserStep1: (
      state,
      action: PayloadAction<Step1>,
    ) => {
      return {
        ...state,
        createUserSteps: {
          ...state.createUserSteps,
          step1: action.payload,
        },
      }
    },
    createUserStep2: (
      state,
      action: PayloadAction<IWorkingHr[]>,
    ) => {
      return {
        ...state,
        createUserSteps: {
          ...state.createUserSteps,
          step2: action.payload,
        },
      }
    },
    createUserStep3: (
      state,
      action: PayloadAction<Step3>,
    ) => {
      return {
        ...state,
        createUserSteps: {
          ...state.createUserSteps,
          step3: action.payload,
        },
      }
    },
    createUser: (state, action: PayloadAction<IUser>) => {
      return {
        ...state,
        createUserSteps,
        userAccounts: [
          ...state.userAccounts,
          action.payload,
        ],
      }
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      return {
        ...state,
        userAccounts: state.userAccounts.map(user =>
          user.id === action.payload.id
            ? action.payload
            : user,
        ),
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        userAccounts: state.userAccounts.filter(
          user => user.id !== action.payload,
        ),
      }
    },

    clearUserInfo: state => {
      return { ...state, createUserSteps }
    },
  },
})

export const {
  createUserStep1,
  createUserStep2,
  createUserStep3,
  createUser,
  updateUser,
  deleteUser,
  clearUserInfo,
} = userAccounts.actions
export default userAccounts.reducer
