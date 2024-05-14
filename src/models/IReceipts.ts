import { ICustomer } from './ICustomer'
import { IStore } from './IStore'
import { IUser } from './IUser'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IReceipt {
  id: any

  user: IUser
  customer: ICustomer
  receipt_track: any[] //TODO: improve this
  store: IStore
  receipt_number: string
  paid_from_cash: number
  paid_from_card: number
  paid_from_bacs: number
  paid_from_credit: number
  total_vat: number
  payment: number
  total: number
  deleted: boolean
  extra_notes: string
  customer_ref: string
  created_at: string
  transaction: number
  sale_invoices: number[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IReceiptNew {}
