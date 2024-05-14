import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import { IWorkingHrWithID } from 'src/models/shared/IWorkingHr'
import {
  IUserRegister,
  IUserWithID,
} from 'src/models/IUser'
import { IStore } from 'src/models/IStore'

export const getUserWorkingHrs = async (
  user_id: number,
  page = 1,
) => {
  const { data } = await httpService.get<
    IPaginatedData<IWorkingHrWithID>
  >(`/account/user/${user_id}/working-hours/?page=${page}`)

  return data
}

export const getUsers = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IUserWithID>
  >(`/account/users/?page=${page}`)

  return data
}

export const getSingleUser = async (id: number) => {
  const { data } = await httpService.get<IUserWithID>(
    `/account/users/${id}`,
  )

  return data
}

export const updateUser = async (
  id: number,
  userData: IUserRegister,
) => {
  const { data } = await httpService.put<IUserWithID>(
    `/account/users/${id}/`,
    userData,
  )

  return data
}

export const updateUserPartial = async (
  id: number,
  userData: IUserRegister,
) => {
  const { data } = await httpService.patch<IUserWithID>(
    `/account/users/${id}/`,
    userData,
  )

  return data
}

export const deleteUser = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/users/${id}/`,
  )

  return data
}

export const getUserStores = async (
  user_id: number,
  page = 1,
) => {
  const { data } = await httpService.get<
    IPaginatedData<IStore>
  >(`/account/users/${user_id}/stores/?page=${page}`)

  return data
}
