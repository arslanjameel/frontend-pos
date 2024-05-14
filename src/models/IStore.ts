export interface IStoreNew {
  name: string
  storeType: string
  store_initial: string
  email: string
  storeEmailPassword: string
  storeAddress: string
  city: number
  country: number
  postalCode: string
  phone: string
  isActive: boolean
  business: number
  bank_account: number

  storeLogo?: string
}

export interface IStore extends IStoreNew {
  id: number
  createdAt: string
  storeLogo: string
  updatedAt: string
  users?: number[]
}

export type IUpdateStore = IStoreNew

export interface IStoreUpdatePartial {
  name?: string
  store_initial?: string
  email?: string
  city?: string
  postalCode?: string
  mobile?: string
  isActive?: boolean
  deletedAt?: string
  business?: number
}
