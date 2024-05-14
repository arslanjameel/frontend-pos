import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import {
  IStoreNew,
  IStore,
  IStoreUpdatePartial,
  IUpdateStore,
} from 'src/models/IStore'
import { IUser } from 'src/models/IUser'

export const getAllStores = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IStore>
  >(`/account/stores/?page=${page}/`)

  return data
}

export const createStore = async (storeData: IStoreNew) => {
  const { data } = await httpService.post<IStore>(
    `/account/stores/`,
    storeData,
  )

  return data
}

export const getSingleStore = async (id: number) => {
  const { data } = await httpService.get<IStore>(
    `/account/stores/${id}/`,
  )

  return data
}

export const updateStore = async (
  id: number,
  storeData: IUpdateStore,
) => {
  const { data } = await httpService.put<IStore>(
    `/account/stores/${id}/`,
    storeData,
  )

  return data
}

export const updateStorePartial = async (
  id: number,
  storeData: IStoreUpdatePartial,
) => {
  const { data } = await httpService.patch<IStore>(
    `/account/stores/${id}/`,
    storeData,
  )

  return data
}

export const deleteStore = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/stores/${id}/`,
  )

  return data
}

export const getStoreUsers = async (store_id: number) => {
  const { data } = await httpService.get<
    IPaginatedData<IUser>
  >(`/account/stores/${store_id}/users/`)

  return data
}
