export interface IStockNew {
  floor: string
  section: string
  quantity: number
  deleted: boolean
  is_active: boolean
  delivery_date: string
  store: number
  stock_status: number
}

export interface IStock extends IStockNew {
  id: number
  created_at: string
  updated_at: string
  product: number
}

export type IStockUpdate = Partial<IStockNew>
