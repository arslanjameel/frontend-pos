import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export const getUrl = (path = '/') => `${BASE_URL}${path}`

const get = <T>(url: string, data?: any) => {
  return axios.get<T>(getUrl(url), data)
}

const post = <T>(url: string, data?: any) => {
  return axios.post<T>(getUrl(url), data)
}

const put = <T>(url: string, data?: any) => {
  return axios.put<T>(getUrl(url), data)
}

const patch = <T>(url: string, data?: any) => {
  return axios.patch<T>(getUrl(url), data)
}

const deleteItem = <T>(url: string, data?: any) => {
  return axios.delete<T>(getUrl(url), data)
}

const setAuthHeaders = (token: string) => {
  axios.defaults.headers.common.Authorization = `token ${token}`
}

const httpService = {
  get,
  post,
  put,
  patch,
  deleteItem,
  setAuthHeaders,
}

export default httpService
