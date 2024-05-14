export interface ICategoryNew {
  name: string
  description: string
  deleted: boolean
  is_active: boolean
}
export interface ICategory extends ICategoryNew {
  id: string
}

export type ICategoryUpdate = Partial<ICategoryNew>
