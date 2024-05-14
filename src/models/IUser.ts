import IWorkingHr, {
  IWorkingHrWithID,
} from './shared/IWorkingHr'

export const UserStatus = {
  Pending: 'Pending',
  Active: 'Active',
  Inactive: 'Inactive',
} as const

export type IUserStatus =
  (typeof UserStatus)[keyof typeof UserStatus]

export const UserStatusColor = {
  Pending: 'warning',
  Active: 'success',
  Inactive: 'error',
} as const

export interface IUpdateUserStatus {
  email: string
  pin_code: string
  new_status: string
}
export interface IUpdateUserPassCode {
  old_password?: string
  new_password?: string
  new_pin_code?: string
}
export interface IUser {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type: string
}

export interface IUserType {
  id: number
  type: string
  description: string
  active: boolean
}

export interface IUserLogin {
  email: string
  password: string
  rememberMe?: boolean
}

export interface IUserRegister {
  first_name: string
  last_name: string
  email: string
  city: number
  country: number
  address: string
  user_type: number
  mobile: string
  password: string
  pin_code: string
  status: IUserStatus
  working_hours: IWorkingHr[]
  stores: number[]
  postalCode: string
  image?: string
}

export interface IUserWithID extends IUserRegister {
  id: number
  working_hours: IWorkingHrWithID[]
  createdAt: string
}

export interface IForgotPassword {
  email: string
}

export interface ILoggedInUser {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type: string
  role?: string
}

export interface IUserLoginResponse {
  user: ILoggedInUser
  token: string
  message: string
}

export type IUpdateUser = Partial<IUserRegister>

export interface IStoreManager {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type: string
  status: IUserStatus
  createdAt: string
  postalCode: string
  deleted: boolean
  isLoggedIn: boolean
}

export type IGeneralUser = IStoreManager
