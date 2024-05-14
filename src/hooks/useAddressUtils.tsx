import { IAddress } from 'src/models/IAddress'
import useGetCityName from './useGetCityName'
import useGetCountryName from './useGetCountryName'

const useAddressUtils = () => {
  const { getCity } = useGetCityName()
  const { getCountry } = useGetCountryName()

  //TODO: combine this file with useGetCustomerAddressInfo

  const getFormattedAddress = (address: IAddress) => {
    return [
      address.addressLine1,
      getCity(address.city),
      address?.postCode,
      getCountry(address.country),
    ].join(', ')
  }

  const getFormattedAddressManual = ({
    addressLine1 = '',
    cityId = 0,
    postCode = '',
    countryId = 0,
  }) => {
    const formattedValues = []

    if (addressLine1.trim()) {
      formattedValues.push(addressLine1.trim())
    }

    if (cityId > 0 && getCity(cityId)) {
      formattedValues.push(getCity(cityId))
    }

    if (postCode.trim()) {
      formattedValues.push(postCode.trim())
    }

    if (countryId > 0 && getCountry(countryId)) {
      formattedValues.push(getCountry(countryId))
    }

    return formattedValues.join(', ') || ''
  }

  return { getFormattedAddress, getFormattedAddressManual }
}

export default useAddressUtils
