import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import { IWebsite, IWebsiteNew } from 'src/models/IWebsite'

export const getWebsites = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IWebsite>
  >(`/account/websites/?page=${page}`)

  return data
}

export const createWebsite = async (
  websiteInfo: IWebsiteNew,
) => {
  const { data } = await httpService.post<IWebsite>(
    `/account/websites/`,
    websiteInfo,
  )

  return data
}

export const getSingleWebsite = async (id: number) => {
  const { data } = await httpService.get<IWebsite>(
    `/account/websites/${id}/`,
  )

  return data
}

export const updateWebsite = async (
  id: number,
  websiteData: IWebsiteNew,
) => {
  const { data } = await httpService.put<IWebsite>(
    `/account/websites/${id}/`,
    websiteData,
  )

  return data
}

export const updateWebsitePartial = async (
  id: number,
  websiteData: IWebsiteNew,
) => {
  const { data } = await httpService.patch<IWebsite>(
    `/account/websites/${id}/`,
    websiteData,
  )

  return data
}

export const deleteWebsite = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/websites/${id}/`,
  )

  return data
}
