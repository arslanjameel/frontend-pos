// ** React Imports
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import httpService from 'src/services/http.service'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, ErrCallbackType } from './types'
import {
  ILoggedInUser,
  IUserLogin,
  IUserLoginResponse,
} from 'src/models/IUser'

import { logoutApi } from 'src/services/account/auth.service'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
import toast from 'react-hot-toast'
import useStorage from 'src/hooks/useStorage'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<ILoggedInUser | null>(
    defaultProvider.user,
  )
  const [loading, setLoading] = useState<boolean>(
    defaultProvider.loading,
  )

  // ** Hooks
  const router = useRouter()

  const {
    setLocalStorageItem,
    setSessionStorageItem,
    getStorageItem,
    removeStorageItem,
  } = useStorage()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const tempStoredToken = getStorageItem(
        authConfig.storageTokenKeyName,
      )
      const tempStoredUser = getStorageItem(
        authConfig.userInfoKeyName,
      )

      if (tempStoredToken && tempStoredUser) {
        const _storedUser: ILoggedInUser =
          JSON.parse(tempStoredUser)

        setUser(_storedUser)
        setLoading(false)

        if (
          router.pathname.includes('login') ||
          router.pathname.includes('register')
        ) {
          router.replace(getHomeRoute())
        }
      } else {
        removeStorageItem(authConfig.storageTokenKeyName)
        removeStorageItem(authConfig.userInfoKeyName)

        setUser(null)
        setLoading(false)

        if (
          !router.pathname.includes('login') &&
          !router.pathname.includes('register') &&
          !router.pathname.includes('forgot-password') &&
          !router.pathname.includes('reset-password')
        ) {
          router.replace('/login')
          setLoading(false)
        }
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (
    params: IUserLogin,
    errorCallback?: ErrCallbackType,
  ) => {
    httpService
      .post<IUserLoginResponse>('/account/login/', params)
      .then((response: any) => {
        if (params.rememberMe) {
          setLocalStorageItem(
            authConfig.storageTokenKeyName,
            response.data.token,
          )
        } else {
          setSessionStorageItem(
            authConfig.storageTokenKeyName,
            response.data.token,
          )
        }

        const _storedUser = {
          ...response.data.user,
        }

        setUser(_storedUser)
        setLoading(false)

        if (params.rememberMe) {
          setLocalStorageItem(
            authConfig.userInfoKeyName,
            JSON.stringify(_storedUser),
          )
        } else {
          setSessionStorageItem(
            authConfig.userInfoKeyName,
            JSON.stringify(_storedUser),
          )
        }

        const returnUrl = router.query.returnUrl
        const redirectURL =
          returnUrl && returnUrl !== '/'
            ? returnUrl
            : getHomeRoute(_storedUser.role)
        router.replace(redirectURL as string)
      })
      .catch(err => {
        const { data } = err.response
        if (errorCallback) errorCallback(data)
        setLoading(false)
      })
  }

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        setUser(null)
        removeStorageItem(authConfig.userInfoKeyName)
        removeStorageItem(authConfig.storageTokenKeyName)
        removeStorageItem('activeStore')
        removeStorageItem('store')
        router.push('/login')
      })
      .catch(() => toast.error('An error occured'))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
