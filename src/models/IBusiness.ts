export interface IBusinessNew {
  name: string
  email: string
  address: string
  city: string
  isActive: boolean
  deletedAt?: string
  owner: number
  businessType: number
}

export interface IBusiness extends IBusinessNew {
  id: number
  updatedAt: string
  createdAt: string
  deletedAt: string
}

export type IBusinessUpdate = IBusinessNew

export interface IBusinessTypeNew {
  type: string
  isActive: boolean
}

export interface IBusinessType extends IBusinessTypeNew {
  id: number
}

export interface IBankAccount {
  id: number
  bankName: string
  bankAccountTitle: string
  accountNumber: number
  sortCode: string
  business: number
}
