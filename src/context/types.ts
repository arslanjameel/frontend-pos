import { ILoggedInUser } from 'src/models/IUser'

export type ErrCallbackType = (err: {
  [key: string]: string
}) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: ILoggedInUser | null
  setLoading: (value: boolean) => void
  setUser: (value: ILoggedInUser | null) => void
  login: (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => void
}
