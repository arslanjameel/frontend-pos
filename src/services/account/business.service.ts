import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import { IStore } from 'src/models/IStore'
import {
  IBusiness,
  IBusinessNew,
  IBusinessUpdate,
} from 'src/models/IBusiness'

export const getAllBusinesses = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IBusiness>
  >(`/account/business/?page=${page}/`)

  return data
}

export const createBusiness = async (
  businessInfo: IBusinessNew,
) => {
  const { data } = await httpService.post<IBusiness>(
    `/account/business/`,
    businessInfo,
  )

  return data
}

export const getSingleBusiness = async (id: number) => {
  const { data } = await httpService.get<IBusiness>(
    `/account/business/${id}/`,
  )

  return data
}

export const updateBusiness = async (
  id: number,
  businessInfo: IBusinessUpdate,
) => {
  const { data } = await httpService.put<IBusiness>(
    `/account/business/${id}/`,
    businessInfo,
  )

  return data
}

export const updateBusinessPartial = async (
  id: number,
  businessInfo: IBusinessUpdate,
) => {
  const { data } = await httpService.patch<IBusiness>(
    `/account/business/${id}/`,
    businessInfo,
  )

  return data
}

export const deleteBusiness = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/business/${id}/`,
  )

  return data
}

export const getBusinessStores = async (
  business_id: number,
) => {
  const { data } = await httpService.get<
    IPaginatedData<IStore>
  >(`/account/businesses/${business_id}/stores/`)

  return data
}
