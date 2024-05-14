export interface ITagNew {
  name: string
  description: string
  deleted: boolean
  is_active: boolean
}

export interface ITag extends ITagNew {
  id: number
  created_at: string
}

export type ITagUpdate = Partial<ITagNew>
