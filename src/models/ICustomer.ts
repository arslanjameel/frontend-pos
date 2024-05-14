import { IAccountType } from './IAccountType'
import { IAddress, IAddressNew } from './IAddress'

export const PriceBand = {
  Band_A: 'A',
  Band_B: 'B',
  Band_C: 'C',
  MATCH_PRICE: 'MATCH',
} as const

export type IPriceBand = keyof typeof PriceBand

export const priceBands = Object.entries(PriceBand)
  .map(pb => ({ value: pb[0], label: pb[1] }))
  .filter(pb => pb.label.length === 1)

export interface ICustomerNew {
  addresses: IAddressNew[]
  accountName: string
  firstName: string
  lastName: string
  email: string
  primaryPhone: string
  secondPhone: string
  priceBand: IPriceBand
  accountType: IAccountType
  currentCredit: string
  creditLimit: string
  deleted?: boolean
  isActive?: boolean
  createdBy: number
  business: number
}

export interface ICustomer extends ICustomerNew {
  id: number
  createdAt: string
  image?: string
  addresses: IAddress[]
}

export type ICustomerUpdate = Partial<ICustomerNew>

export interface ICustomerUpdateForm {
  accountName: string
  email: string
  firstName: string
  lastName: string
  primaryPhone: string
  secondPhone: string
  priceBand: IPriceBand
  creditLimit: string
  accountType: IAccountType
  business: number
  addresses: IAddress[]
  createdBy: number
  currentCredit: string
}
