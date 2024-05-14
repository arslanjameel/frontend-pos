export interface IProductStatusNew {
  name: string
  description: string
  deleted: boolean
  is_active: boolean
}

export interface IProductStatus extends IProductStatusNew {
  id: number
  created_at: string
}

export type IProductStatusUpdate =
  Partial<IProductStatusNew>
