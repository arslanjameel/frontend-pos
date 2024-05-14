import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import {
  IBusinessType,
  IBusinessTypeNew,
} from 'src/models/IBusiness'

export const getAllBusinessTypes = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IBusinessType>
  >(`/account/business-type/?page=${page}/`)

  return data
}

export const createBusinessType = async (
  businessType: IBusinessTypeNew,
) => {
  const { data } = await httpService.post<IBusinessType>(
    `/account/business-type/`,
    businessType,
  )

  return data
}

export const getSingleBusinessType = async (id: number) => {
  const { data } = await httpService.get<IBusinessType>(
    `/account/business-type/${id}/`,
  )

  return data
}

export const updateBusinessType = async (
  id: number,
  businessType: IBusinessTypeNew,
) => {
  const { data } = await httpService.put<IBusinessType>(
    `/account/business-type/${id}/`,
    businessType,
  )

  return data
}

export const updateBusinessTypePartial = async (
  id: number,
  businessType: IBusinessTypeNew,
) => {
  const { data } = await httpService.patch<IBusinessType>(
    `/account/business-type/${id}/`,
    businessType,
  )

  return data
}

export const deleteBusinessType = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/business-type/${id}/`,
  )

  return data
}
