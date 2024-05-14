export interface IBrandNew {
  name: string
  description: string
  deleted: boolean
  hide_product_costs: boolean
}

export interface IBrand extends IBrandNew {
  id: number
  created_at: string
  is_active: boolean
}

export type IBrandUpdate = Partial<IBrandNew>
