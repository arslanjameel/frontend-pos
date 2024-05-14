import { ICustomer } from './ICustomer'
import { IStore } from './IStore'
import { IGeneralUser } from './IUser'

export interface IProductReturnedOn {
  id: number
  faulty: boolean
  sku: string
  alternate_sku?: string
  product_name: string
  return_note: string
  quantity_returned: number
  invoice_position: number
  return_price: string
  restocking_fee: string
  return_date: string
  deleted: boolean
  product_sold_on: number
}
export interface ISaleReturnNew {
  return_number: string
  paid_from_cash: string
  paid_from_card: string
  paid_from_bacs: string
  paid_from_credit: string
  total_vat: string
  extra_notes: string
  payment_to_customer: string
  total: string
  total_restocking_fee: string
  quantity: number
  over_charge: boolean
  deleted: boolean
  sale_invoices: number
  user: number
  customer: number
  store: number
}

export type ISaleReturnUpdate = Partial<ISaleReturnNew>

export interface ISaleReturn {
  id: number
  user: IGeneralUser
  customer: ICustomer
  return_on: IProductReturnedOn[]
  sale_invoices: {
    id: string
    invoice_number: string
    created_at: string
  }
  return_number: string
  paid_from_cash: string
  paid_from_card: string
  paid_from_bacs: string
  paid_from_credit: string
  total_vat: string
  extra_notes: string
  payment_to_customer: string
  total: string
  total_restocking_fee: string
  quantity: number
  over_charge: boolean
  deleted: boolean
  store: IStore
  created_at: string
  customer_reference: string
}
