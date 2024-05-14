import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import httpService from '../http.service'
import ICountry, { ICity } from 'src/models/shared/ICountry'

export const getCities = async (page = 1) => {
  const { data } = await httpService.get<
    IPaginatedData<ICity>
  >(`/account/city/?page=${page}/`)

  return data
}

export const getCountryCities = async (
  country_id: number,
  page = 1,
) => {
  const { data } = await httpService.get<
    IPaginatedData<ICity>
  >(`/account/city/${country_id}/?page=${page}/`)

  return data
}

export const getCountries = async () => {
  const { data } = await httpService.get<
    IPaginatedData<ICountry>
  >(`/account/country/`)

  return data
}
