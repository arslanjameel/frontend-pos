interface StorageMethods {
  getLocalStorageItem: (key: string) => string | null
  getSessionStorageItem: (key: string) => string | null
  setLocalStorageItem: (key: string, value: string) => void
  setSessionStorageItem: (
    key: string,
    value: string,
  ) => void
  getStorageItem: (key: string) => string | null
  removeStorageItem: (key: string) => void
}

const useStorage = (): StorageMethods => {
  const getLocalStorageItem = (key: string) =>
    window.localStorage.getItem(key)
  const setSessionStorageItem = (
    key: string,
    value: string,
  ) => window.sessionStorage.setItem(key, value)

  const getSessionStorageItem = (key: string) =>
    window.sessionStorage.getItem(key)
  const setLocalStorageItem = (
    key: string,
    value: string,
  ) => window.localStorage.setItem(key, value)

  const getStorageItem = (key: string) => {
    const _sessionItem = getSessionStorageItem(key)
    const _localItem = getLocalStorageItem(key)

    return _sessionItem || _localItem
  }

  const removeStorageItem = (key: string) => {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  }

  return {
    getLocalStorageItem,
    getSessionStorageItem,
    setLocalStorageItem,
    setSessionStorageItem,
    getStorageItem,
    removeStorageItem,
  }
}

export default useStorage

// interface StorageMethods {
//   getCookieItem: (key: string) => string | null
//   setCookieItem: (key: string, value: string, options?: CookieOptions) => void
//   getStorageItem: (key: string) => string | null
//   removeStorageItem: (key: string) => void
// }

// interface CookieOptions {
//   expires?: number | Date
//   path?: string
//   domain?: string
//   secure?: boolean
//   sameSite?: 'strict' | 'lax' | 'none'
// }

// const useStorage = (): StorageMethods => {
//   const getCookieItem = (key: string) => {
//     const cookies = document.cookie.split(';').map(cookie => cookie.trim())
//     const cookie = cookies.find(cookie => cookie.startsWith(`${key}=`))

//     return cookie ? cookie.split('=')[1] : null
//   }

//   const setCookieItem = (key: string, value: string, options?: CookieOptions) => {
//     let cookieString = `${key}=${value}`

//     if (options) {
//       if (options.expires) {
//         if (options.expires instanceof Date) {
//           cookieString += `; expires=${options.expires.toUTCString()}`
//         } else {
//           const expires = new Date(Date.now() + options.expires * 1000)
//           cookieString += `; expires=${expires.toUTCString()}`
//         }
//       }

//       if (options.path) {
//         cookieString += `; path=${options.path}`
//       }

//       if (options.domain) {
//         cookieString += `; domain=${options.domain}`
//       }

//       if (options.secure) {
//         cookieString += '; secure'
//       }

//       if (options.sameSite) {
//         cookieString += `; samesite=${options.sameSite}`
//       }
//     }

//     document.cookie = cookieString
//   }

//   const getStorageItem = (key: string) => getCookieItem(key)

//   const removeStorageItem = (key: string) => {
//     document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
//   }

//   return {
//     getCookieItem,
//     setCookieItem,
//     getStorageItem,
//     removeStorageItem
//   }
// }

// export default useStorage
