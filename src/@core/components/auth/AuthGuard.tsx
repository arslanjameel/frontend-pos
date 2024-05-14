// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

import authConfig from 'src/configs/auth'
import useStorage from 'src/hooks/useStorage'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const { getStorageItem } = useStorage()

  useEffect(
    () => {
      if (!router.isReady) return

      if (
        auth.user === null &&
        !getStorageItem(authConfig.userInfoKeyName)
      ) {
        if (
          !router.pathname.includes('login') &&
          !router.pathname.includes('register') &&
          !router.pathname.includes('reset-password') &&
          !router.pathname.includes('forgot-password')
        ) {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route],
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
