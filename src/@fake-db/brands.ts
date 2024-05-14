export interface IBrand {
  id: number
  brandName: string
  brandDescription?: string
  brandStatus?: string

  automation?: string
  conditions?: any[]

  automationKey?: any[]
  automationCondition?: any[]
  anyOrAll?: string

  status?: 0 | 1
}

export const fakeBrandsData: IBrand[] = [
  {
    id: 1,
    brandName: 'Brand A',
    brandDescription: 'Some description',
    automation: '1',
    status: 1,
  },
  {
    id: 2,
    brandName: 'Brand B',
    brandDescription: 'Some description',
    automation: '0',
    status: 0,
  },
]
