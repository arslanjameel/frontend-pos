export interface ICommentNew {
  comment: string
  deleted?: boolean
  customer: number
  commentBy: number
}

export interface IComment extends ICommentNew {
  id: number
  createdAt: string
}

export type ICommentUpdate = ICommentNew
