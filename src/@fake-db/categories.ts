export interface ICategory {
  id: number
  name?: string
  description?: string

  automation?: 0 | 1

  categoryName: string
  subCategories?: any[]
  parentCategory?: string
  categoryDescription?: string
  categoryStatus?: string
  metaTagTitle?: string
  metaTagDescription?: string
  metaTagKeywords?: string

  conditions?: any[]

  automationKey?: any[]
  automationCondition?: any[]

  anyOrAll?: string
}

export const fakeCategoriesData: ICategory[] = [
  {
    id: 1,
    name: 'Category A',
    categoryDescription: 'Some description',
    automation: 1,
    categoryName: 'Category A',
  },
  {
    id: 2,
    name: 'Category B',
    categoryDescription: 'Some description on B',
    automation: 0,
    categoryName: 'Category B',
  },
]
