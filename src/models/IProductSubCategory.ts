export interface IProductSubCategoryNew {
  name: string
  description: string
  deleted: boolean
  parent_sub_category: number
  category: number
}

export interface IProductSubCategory
  extends IProductSubCategoryNew {
  id: number
  created_at: string
}

export type IProductSubCategoryUpdate =
  Partial<IProductSubCategoryNew>
