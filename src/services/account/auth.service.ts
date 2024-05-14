import axios from 'axios'

import {
  IForgotPassword,
  IUserLogin,
  IUserLoginResponse,
  IUserRegister,
} from 'src/models/IUser'
import httpService, { getUrl } from '../http.service'

export const loginUser = async (
  credentials: IUserLogin,
) => {
  const { data } =
    await httpService.post<IUserLoginResponse>(
      '/account/login/',
      credentials,
    )

  return data
}

export const registerUser = async (
  userInfo: IUserRegister,
) => {
  const { data } = await httpService.post(
    '/account/register',
    userInfo,
  )

  return data
}

export const forgotPassword = async (
  userInfo: IForgotPassword,
) => {
  const { data } = await httpService.post(
    '/account/forgot-password/',
    userInfo,
  )

  return data
}

export const resetPassword = async (
  params: {
    userId: string
    token: string
    expiration_time: string
  },
  body: { new_password: string },
) => {
  const { data } = await axios.post(
    getUrl(
      `/account/reset-password/${params.userId}/${params.token}/${params.expiration_time}/`,
    ),
    body,
  )

  return data
}

export const logoutApi = async () => {
  const storedToken =
    window.sessionStorage.getItem('accessToken') ||
    window.localStorage.getItem('accessToken')

  if (storedToken) {
    const headers = {
      Authorization: `token ${storedToken}`,
    }
    const { data } = await axios.post(
      getUrl('/account/logout/'),
      null,
      {
        headers,
      },
    )

    return data
  }
}
