export interface IMarkCompletedNew {
  mark_date: string
  sale_invoice: number | null
  sale_order: number | null
  comments?: string
  tracking_number?: string
  products_track: {
    product: number
    id: number
    sku: string
    alternate_sku: string
    product_name: string
    product_delivery_status: string
    delivery_mode: string
    quantity: number
    delivered: number
    returned: number
    delivered_now: number
  }[]
  user: number
  verified_by: number
}
export interface IMarkCompleted extends IMarkCompletedNew {
  id: number
  created_at: string
}

export type IMarkCompletedUpdate =
  Partial<IMarkCompletedNew>
