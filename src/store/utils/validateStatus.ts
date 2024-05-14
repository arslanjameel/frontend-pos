export const validateStatus = (response: Response) => {
  const returnUrl = window.location.pathname

  if (
    response.status === 401 &&
    !window.location.pathname.includes('/register') &&
    !window.location.pathname.includes('/reset-password') &&
    !window.location.pathname.includes('/forgot-password')
  ) {
    window.localStorage.removeItem('store')
    window.localStorage.removeItem('activeStore')

    window.localStorage.removeItem('user')
    window.localStorage.removeItem('accessToken')

    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('accessToken')

    window.location.href =
      '/login' +
      (returnUrl
        ? `?returnUrl=${encodeURIComponent(returnUrl)}`
        : '')

    return false
  }

  return true
}
