interface ICountry {
  id: number
  name: string
}

export interface ICity extends ICountry {
  country: number
}

export default ICountry
