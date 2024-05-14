import { ICity } from 'src/models/shared/ICountry'
import { useGetCitiesQuery } from 'src/store/apis/accountSlice'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useGetCityName = (cities?: ICity[]) => {
  const { data: _cities } = useGetCitiesQuery()

  const getCity = (cityId: number) => {
    const city = (_cities || []).find(
      c => c.id === Number(cityId),
    )

    return city ? city.name : ''
  }

  return { getCity }
}

export default useGetCityName
