export const prepareHeaders = (headers: Headers, {}) => {
  const token =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken')

  if (token) headers.set('Authorization', `token ${token}`)

  return headers
}
