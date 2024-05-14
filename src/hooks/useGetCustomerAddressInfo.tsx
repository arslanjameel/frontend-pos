import { IAddress } from 'src/models/IAddress'
import useGetCityName from './useGetCityName'
import useGetCountryName from './useGetCountryName'

const useGetCustomerAddressInfo = (
  addresses: IAddress[],
) => {
  const { getCity } = useGetCityName()
  const { getCountry } = useGetCountryName()

  const getAddress = (id: number): IAddress => {
    const address = (addresses || []).find(
      addr => addr.id === id,
    )
    if (address) return address

    return {
      addressLine1: '',
      addressNickName: '',
      addressType: 'shippingAddress',
      city: 0,
      country: 0,
      createdAt: '',
      fullName: '',
      id: 0,
      postCode: '',
      addressLine2: '',
    }
  }

  const getAddressStr = (id: number) => {
    const address = getAddress(id)

    return [
      address.addressLine1,
      getCity(address?.city),
      address.postCode,
      getCountry(address?.country),
    ].join('\n')
  }

  return { getAddress, getAddressStr }
}

export default useGetCustomerAddressInfo
