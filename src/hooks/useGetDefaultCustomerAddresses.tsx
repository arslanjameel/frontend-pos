import { IAddress } from 'src/models/IAddress'

// import AddressCard from 'src/components/invoices/AddressCard'
// import useGetCountryName from './useGetCountryName'
// import {
//   useGetCitiesQuery,
//   useGetCountriesQuery,
// } from 'src/store/apis/accountSlice'
// import useGetCityName from './useGetCityName'

interface Props {
  addresses: IAddress[]
}

const useGetDefaultCustomerAddresses = ({
  addresses,
}: Props) => {
  //     const { data: countries } = useGetCountriesQuery()
  //   const { data: cities } = useGetCitiesQuery()
  //   const { getCity } = useGetCityName(
  //     cities ? cities : [],
  //   )
  //   const { getCountry } = useGetCountryName(
  //     countries ? countries : [],
  //   )

  const getDefaultBilling = (
    addresses1?: IAddress[],
  ): IAddress => {
    const address = (addresses1 || addresses).find(
      addr => addr.defaultBilling,
    )

    if (address) {
      return address
    }

    return addresses[0]
  }
  const getDefaultShipping = (
    addresses1?: IAddress[],
  ): IAddress => {
    const address = (addresses1 || addresses).find(
      addr => addr.defaultShipping,
    )

    if (address) {
      return address
    }

    return addresses[0]
  }

  return { getDefaultBilling, getDefaultShipping }
}

export default useGetDefaultCustomerAddresses
