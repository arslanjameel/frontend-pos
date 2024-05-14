import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import IWorkingHr, {
  IWorkingHrWithID,
} from 'src/models/shared/IWorkingHr'

export const getWorkingHors = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<IWorkingHrWithID>
  >(`/account/working-hours/?page=${page}`)

  return data
}

export const createWorkingHr = async (
  workingHrInfo: IWorkingHr,
) => {
  const { data } = await httpService.post<IWorkingHrWithID>(
    `/account/working-hours/`,
    workingHrInfo,
  )

  return data
}

export const getSingleWorkingHr = async (id: number) => {
  const { data } = await httpService.get<IWorkingHrWithID>(
    `/account/working-hours/${id}/`,
  )

  return data
}

export const updateWorkingHr = async (
  id: number,
  workingHrInfo: IWorkingHr,
) => {
  const { data } = await httpService.put<IWorkingHrWithID>(
    `/account/working-hours/${id}/`,
    workingHrInfo,
  )

  return data
}

export const updateWorkingHrPartial = async (
  id: number,
  workingHrInfo: IWorkingHr,
) => {
  const { data } =
    await httpService.patch<IWorkingHrWithID>(
      `/account/working-hours/${id}/`,
      workingHrInfo,
    )

  return data
}

export const deleteWebsite = async (id: number) => {
  const { data } = await httpService.deleteItem(
    `/account/working-hours/${id}/`,
  )

  return data
}
