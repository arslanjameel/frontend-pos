import { compareDesc, parseISO } from 'date-fns'
import { IAddress, IAddressType } from 'src/models/IAddress'
import ICountry, { ICity } from 'src/models/shared/ICountry'

export const getAddressInfo = (
  addresses: IAddress[],
  params: { addressType?: IAddressType; id?: number } = {},
): IAddress => {
  const addrId = params.id

  if (addrId) {
    const address = addresses.find(
      addr => addr.id === addrId,
    )

    if (address) {
      return address
    }
  }

  return {
    id: 1,
    customer: 1,
    addressNickName: '--',
    fullName: '--',
    country: 1,
    city: 1,
    addressType: 'billingAddress',
    addressLine1: '--',
    addressLine2: '--',
    postCode: '--',
    deleted: false,
    isActive: true,
    createdAt: '2023-11-30T05:43:09.164554Z',
  }
}

export const sortAddressesByDate = (
  addresses: IAddress[],
) => {
  const _addresses = [...addresses]
  let res: IAddress[] = []

  try {
    res = _addresses.sort((a, b) =>
      compareDesc(
        parseISO(a.createdAt),
        parseISO(b.createdAt),
      ),
    )
  } catch (e) {
    res = []
  }

  return res
}

export const getCountryName = (
  countryId: number,
  countries: ICountry[],
) => {
  const country = countries.find(
    c => c.id === Number(countryId),
  )

  return country ? country.name : '--'
}

export const getCityName = (
  cityId: number,
  countries: ICity[],
) => {
  const city = countries.find(c => c.id === Number(cityId))

  return city ? city.name : '--'
}
