export interface IProductPriceNew {
  price_a: number
  price_b: number
  price_c: number
  unit_cost: number
  average_unit_cost: number
  is_active: boolean
  end_date_at?: string
}

export interface IProductPrice extends IProductPriceNew {
  id: number
  created_at: string
  updated_at: string
}

export type IProductPriceUpdate = Partial<IProductPriceNew>
