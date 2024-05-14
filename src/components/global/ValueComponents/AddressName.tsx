import useGetCityName from 'src/hooks/useGetCityName'
import useGetCountryName from 'src/hooks/useGetCountryName'
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
} from 'src/store/apis/accountSlice'
import { useGetSingleAddressQuery } from 'src/store/apis/customersSlice'

interface Props {
  addressId?: number
  separator?: 'comma' | 'newline'
}

const Separator = {
  comma: ', ',
  newline: '\n',
} as const

const AddressName = ({
  addressId,
  separator = 'comma',
}: Props) => {
  const {
    data: address,
    error,
    isLoading,
  } = useGetSingleAddressQuery(addressId || -1)

  const { data: cities } = useGetCitiesQuery()
  const { getCity } = useGetCityName(cities || [])

  const { data: countries } = useGetCountriesQuery()
  const { getCountry } = useGetCountryName(countries || [])

  if (isLoading) return 'Getting address info...'

  if (error || !address) return 'Address Not Found'

  const values = [
    address.addressLine1,

    address.postCode,

    getCity(address?.city),

    getCountry(address?.country),
  ]

  return values.join(Separator[separator])
}

export default AddressName
