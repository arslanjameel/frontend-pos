export type IAddressType =
  | 'billingAddress'
  | 'shippingAddress'

export interface IAddressNew {
  customer?: number
  country: number
  city: number
  addressNickName: string
  fullName: string
  addressLine1: string
  addressLine2?: string

  postCode: string
  deleted?: boolean
  isActive?: boolean

  billingAddress?: boolean
  shippingAddress?: boolean
  defaultBilling?: boolean
  defaultShipping?: boolean

  //TODO: DEPRECATE THIS
  addressType: IAddressType
}

export interface IAddress extends IAddressNew {
  id: number
  createdAt: string
}

export type IAddressUpdate = Partial<IAddressNew>
