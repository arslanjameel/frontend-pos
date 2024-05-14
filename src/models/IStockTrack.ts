export interface IStockTrackNew {
  purchase_cost: string
  purchase_date: string
  sold_date: string
  quantity_bought: number
  quantity_sold: number
  reserved_date: string
  reserved_quantity: number
  quantity_left: number
  quantity_merged: number
  return_date: string
  quantity_return: number
  return_quantity_left: number
  product: number
  stock: number
  used_stock: number
}

export interface IStockTrack extends IStockTrackNew {
  id: number
}

export type IStockTrackUpdate = Partial<IStockTrackNew>
