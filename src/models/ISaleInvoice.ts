import { IAccountType } from './IAccountType'
import { IAddress, IAddressNew } from './IAddress'
import { ICustomer, IPriceBand } from './ICustomer'
import { IStore } from './IStore'
import { IGeneralUser } from './IUser'

export const DeliveryStatus = {
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  PARTIAL: 'partial',
  RETURNED: 'returned',

  VOID: 'void', //!REMOVE THIS
} as const

export type IDeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus]

export const InvoiceStatus = {
  CLEARED: 'cleared',
  PAID: 'paid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  VOID: 'void',
} as const

export type IInvoiceStatus =
  (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const ProductStatus = {
  PICKUP: 'pick_up',
  COLLECTED: 'collected',
  DELIVERY: 'delivery',
  SUPPLIERDELIVERY: 'supplier_delivery',
} as const

export type IProductStatus =
  (typeof ProductStatus)[keyof typeof ProductStatus]

export const ProductDeliveryStatus = {
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  PARTIAL: 'partial',
  VOID: 'void',
} as const

export type IProductDeliveryStatus =
  (typeof ProductDeliveryStatus)[keyof typeof ProductDeliveryStatus]

export const deliveryModeOptionsPretty: {
  label: string
  value: IProductDeliveryMode
}[] = [
  { label: 'Customer Collection', value: 'collected' },
  { label: 'Store Delivery', value: 'delivery' },
  {
    label: 'Supplier Delivery',
    value: 'supplier_delivery',
  },
]

export const deliveryModeOptionsPretty2: {
  [key in IProductDeliveryMode]: string
} = {
  collected: 'Customer Collection',
  pick_up: 'Pick Up',
  delivery: 'Store Delivery',
  supplier_delivery: 'Supplier Delivery',
}

export const ProductDeliveryMode = {
  COLLECTED: 'collected',
  PICK_UP: 'pick_up',
  DELIVERY: 'delivery',
  SUPPLIERDELIVERY: 'supplier_delivery',
} as const

export type IProductDeliveryMode =
  (typeof ProductDeliveryMode)[keyof typeof ProductDeliveryMode]

export type ISaleTransactionType =
  | 'invoice'
  | 'quote'
  | 'order'
interface IInvoiceUserNew {
  first_name?: string
  last_name?: string
  email: string
}

export interface IInvoiceUser extends IInvoiceUserNew {
  id: number
  user_type: string
}

interface IInvoiceCustomerNew {
  addresses: IAddressNew[]
  accountName: string
  firstName?: string
  lastName?: string
  email: string
  primaryPhone?: string
  secondPhone?: string
  priceBand: IPriceBand
  accountType?: IAccountType
  currentCredit: number
  creditLimit: number
  deleted: boolean
  isActive: boolean
  createdBy: number
  business?: number
}

export interface IInvoiceCustomer
  extends IInvoiceCustomerNew {
  id: number
  addresses: IAddress[]
  image: string

  createdAt: string
}

export interface IInvoiceProduct {
  id: number
  sku: string
  alternate_sku?: string
  product_name: string
  product_note: string

  // percentage_margin: number
  sold_price_band: string
  product_delivery_status: IProductDeliveryStatus
  discount: number
  vat: number

  // profit_margin: number
  quantity_sold: number
  quantity_delivered: number
  invoice_position: number
  sold_date?: string
  sold_price: number
  unit_price: number
  average_unit_price: number
  to_be_ordered?: boolean
}

export interface ProductSoldOn {
  id: number
  product_note: string
  sold_price_band: string
  sku: string
  alternate_sku: string
  product_name: string
  sold_price: number
  unit_price: number
  discount: string
  vat: number
  product_delivery_status: IProductDeliveryStatus
  delivery_mode: string
  quantity_delivery: IProductDeliveryMode
  quantity_sold: number
  quantity_delivered: number
  quantity_reserved: number
  products_returned: number
  quantity_to_be_ordered: number
  to_be_ordered?: boolean
  invoice_position: number
  sold_date: string
  deleted: boolean
  created_at: string
  sale_invoice: number
  transaction: number
  product: number

  // percentage_margin: string
  // profit_margin: string
}

export interface ITransaction {
  id: number
  transaction_number: string
  paid_from_cash: string
  paid_from_card: string
  paid_from_bacs: string
  paid_from_credit: string
  total_discount: string
  total_delivery: string
  total_vat: string
  transaction_type: ISaleTransactionType
  payment: string
  total: string
  transaction_date: string
  extra_notes: string
  discount: string
  payable: string
  profit_margin: string
  percentage_margin: string
  created_at: string
  deleted: boolean
  updated_at: string
  user: number
  store: number
  customer: number
  customer_reference: number
}

// Invoice Types

export interface ISaleInvoiceNew {
  user: number

  // customer: IInvoiceCustomerNew
  // user: IInvoiceUserNew
  customer: number
  invoice_number?: string
  payment: number
  total: number
  quantity: number
  invoice_status?: IInvoiceStatus
  extra_notes?: string
  invoice_to?: string
  deliver_to?: string

  is_direct_delivery?: boolean
  paid_from_cash: number
  paid_from_card: number
  paid_from_bacs: number
  paid_from_credit: number

  total_discount: number
  total_delivery: number
  total_vat: number

  delivery_status?: IDeliveryStatus
  order_status?: 'pending' | 'ordered'

  invoice_reference?: string

  payable: number
  cash: number
  card: number

  // total_margin: number
  // total_percentage_margin: number

  deleted?: boolean
  sale_order: number | null
  payment_type: number
  transaction_type: ISaleTransactionType
  store: number
  products: IInvoiceProduct[]

  //temp
  delivery_mode?: string
}

export interface ISaleInvoice {
  id: number
  sold_on_invoice: ProductSoldOn[]
  user: IGeneralUser
  customer: ICustomer
  transaction: ITransaction
  invoice_number?: string
  paid_from_cash: number
  paid_from_card: number
  paid_from_bacs: number
  paid_from_credit: number

  total_discount: number
  total_delivery: number
  total_vat: number
  payment: number
  total: number
  quantity: number
  invoice_status?: IInvoiceStatus
  delivery_status?: IDeliveryStatus
  extra_notes?: string
  invoice_to?: string
  deliver_to?: string
  invoice_reference?: string
  deleted?: boolean
  created_at: string
  sale_order: number | null
  store: IStore
  products: number[]

  // payable: number
  // cash: number
  // card: number
  // discount: number
  // total_margin: number
  // total_percentage_margin: number

  // payment_type: number
  // transaction_type: number
}

export type ISaleInvoiceUpdate = ISaleInvoiceNew
