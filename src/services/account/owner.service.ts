import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import { IOwner, IOwnerNew } from 'src/models/IOwner'
import { IBusiness } from 'src/models/IBusiness'

export const getAllOwners = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IOwner>
  >(`/account/owner/?page=${page}/`)

  return data
}

export const createOwner = async (owner: IOwnerNew) => {
  const { data } = await httpService.post<IOwner>(
    `/account/owner/`,
    owner,
  )

  return data
}

export const getSingleOwner = async (id: number) => {
  const { data } = await httpService.get<IOwner>(
    `/account/owner/${id}/`,
  )

  return data
}

export const updateOwner = async (
  id: number,
  owner: IOwnerNew,
) => {
  const { data } = await httpService.put<IOwner>(
    `/account/owner/${id}/`,
    owner,
  )

  return data
}

export const updateOwnerPartial = async (
  id: number,
  owner: IOwnerNew,
) => {
  const { data } = await httpService.patch<IOwner>(
    `/account/owner/${id}/`,
    owner,
  )

  return data
}

export const deleteOwner = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/owner/${id}/`,
  )

  return data
}

export const getOwnerBusinesses = async (
  owner_id: number,
  page = 1,
) => {
  const { data } = await httpService.get<
    IPaginatedData<IBusiness>
  >(`/account/owner/${owner_id}/business/?page=${page}/`)

  return data
}
