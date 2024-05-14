import { IUserType } from 'src/models/IUser'
import httpService from '../http.service'
import { IPaginatedData } from 'src/models/shared/IPaginatedData'

export const getUserTypes = async () => {
  const { data } = await httpService.get<
    IPaginatedData<IUserType>
  >(`/account/user-type/`)

  return data
}
