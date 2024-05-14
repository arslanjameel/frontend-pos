export interface ISaleDeliveryNoteTrackNew {
  sku: string
  alternate_sku: string
  product_name: string
  total_quantity: number
  delivered: number
  delivered_now: number
  deleted?: boolean
  sale_delivery_note?: string
}

export interface ISaleDeliveryNoteTrack
  extends ISaleDeliveryNoteTrackNew {
  id: number
  created_at: string
}

export interface ISaleDeliveryNoteNew {
  sale_delivery_note_track: ISaleDeliveryNoteTrackNew[]
  store_address: string
  customer_number: string
  customer_name: string
  customer_ref: string
  delivery_date: string
  delivery_time?: string
  notes: string
  delivery_address: string
  total_product_ordered: number
  total_product_delivered: number
  deleted?: boolean
  user: number
  sale_invoice?: number
  sale_order: number | null
}

export interface ISaleDeliveryNote
  extends ISaleDeliveryNoteNew {
  id: number
  created_at: string
}

export type ISaleDeliveryNoteUpdate =
  Partial<ISaleDeliveryNote>
