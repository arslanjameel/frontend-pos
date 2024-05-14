import {
  IProductPrice,
  IProductPriceNew,
} from './IProductPrice'
import { IProductStatus } from './ISaleInvoice'
import { IStock, IStockNew } from './IStock'

export interface IProductNew {
  product_price: IProductPriceNew[]
  product_stock: IStockNew[]
  category: number[]
  tag: number[]
  sku: string
  alternate_sku?: string
  product_name: string
  descriptions: string
  description: string
  barcode: string
  deleted: boolean
  is_temporary_product: boolean
  is_product_to_be_ordered: boolean
  is_active: boolean
  created_by: number
  published_by: number
  image: string
  brand: number
  merged_record?: number
  related_products?: number[]
  sub_category: any
}

export interface IProduct extends IProductNew {
  quantity_left: number
  id: number
  created_at: string
  product_price: IProductPrice[]
  product_stock: IStock[]
  price: IProductPrice
  stock: IStock
  invoice_number: number
}

export type IProductUpdate = Partial<IProductNew>

export interface ISaleProduct {
  id: number
  sku: string
  alternate_sku?: string
  product_name: string
  product_note: string

  // percentage_margin: number
  sold_price_band: string
  discount: number
  vat: number
  product_delivery_status: IProductStatus

  // profit_margin: number
  quantity_sold: number
  invoice_position: number
  sold_date?: string
  sold_price: number
  unit_price: number
  average_unit_price: number
  to_be_ordered: boolean
  product_price: IProductPrice[]
  product_stock: IStock[]

  // custom
  total?: number
}

export interface IQuoteProduct {
  id: number
  sku: string
  alternate_sku: string
  product_name: string
  product_note: string
  quote_price_band: string
  quantity: number
  quote_position: number
  quote_price: string
  unit_price: number
  average_unit_price: number
  product: number
  discount: number
  price?: {
    id: number
    price_a: number
    price_b: number
    price_c: number
    unit_cost: number
    average_unit_cost: number
  }
  total: number
}
