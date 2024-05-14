export const PayTypes = {
  Credit: 1,
  Cash: 2,
  Card: 3,
  BACS: 4,
} as const

export type IPayTypes =
  (typeof PayTypes)[keyof typeof PayTypes]

export type IPayTypeKeys = keyof typeof PayTypes

export interface IPayInfo {
  id: IPayTypes
  title: IPayTypeKeys
  amount: number
  extraTitle?: string
  extraAmount?: number
}
