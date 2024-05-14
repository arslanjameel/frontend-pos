export type IProductStatus = 0 | 1 | 2 | 3

export type IProductStock = {
  id: number
  quantity: number
  store: number
  floor: string
  section: string
  supplier: number
  unit_cost: number
  delivery_date: null
}

export type IProductPurchase = {
  id: number
  quantity: number
  supplier: number
  date: string
  cost: number
}

export type IProductSupplier = {
  id: number
  supplier_cost: string
  supplier_sku: string
  default: boolean
  supplier: number
}
