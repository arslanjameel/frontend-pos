export interface IMetaOptionNew {
  meta_tag_title: string
  meta_tag_description: string
  meta_tag_keywords: string
  deleted: boolean
  category: number
}

export interface IMetaOption extends IMetaOptionNew {
  id: number
  created_at: string
}

export type IMetaOptionUpdate = Partial<IMetaOptionNew>
