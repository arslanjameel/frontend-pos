import ICountry from 'src/models/shared/ICountry'
import { useGetCountriesQuery } from 'src/store/apis/accountSlice'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useGetCountryName = (countries?: ICountry[]) => {
  const { data: _countries } = useGetCountriesQuery()

  const getCountry = (countryId: number) => {
    const country = (_countries || []).find(
      c => c.id === Number(countryId),
    )

    return country ? country.name : ''
  }

  return { getCountry }
}

export default useGetCountryName
