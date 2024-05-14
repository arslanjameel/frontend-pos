export interface IRoleStores {
  role: string
  stores: string[]
}

export interface IWorkWeekHours {
  dayOfWeek: string
  status: boolean
  startTime: string
  endTime: string
}

export interface IData {
  [key: string]: any
}

export interface IAddress {
  id?: number
  title: string
  fullName?: string
  addressName: string
  addressLine: string
  postCode: string
  city: string
  country: number
  isDefaultShipping?: boolean
  isDefaultBilling?: boolean
  customerId?: number
}

/**
 *
 * User Info Types
 */

export interface IUserNew {
  id: number
  last_name: string
  first_name: string
  mobile: string
  email?: string //TODO: make mandatory
  address: string
  role: string
  status: number
  country: string
  joinedOn: string
  img?: string
}

/**
 *
 * User Info Types
 */

export interface IUserNew {
  id: number
  last_name: string
  first_name: string
  mobile: string
  email?: string //TODO: make mandatory
  address: string
  role: string
  status: number
  country: string
  joinedOn: string
  img?: string
}
