export interface IStockStatusNew {
  status: string
  description: string
  deleted: boolean
  is_active: boolean
}

export interface IStockStatus extends IStockStatusNew {
  id: number
  created_at: string
}

export type IStockStatusUpdate = Partial<IStockStatusNew>
