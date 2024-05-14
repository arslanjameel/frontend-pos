// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

import authConfig from 'src/configs/auth'
import useStorage from 'src/hooks/useStorage'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const { getStorageItem } = useStorage()

  useEffect(() => {
    if (!router.isReady) return

    if (getStorageItem(authConfig.userInfoKeyName)) {
      router.replace(getHomeRoute())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (
    auth.loading ||
    (!auth.loading && auth.user !== null)
  ) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
