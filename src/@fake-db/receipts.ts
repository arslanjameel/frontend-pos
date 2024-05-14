export type IReceiptStatus = 0 | 1
export type IReceiptType = 'cash' | 'card'

export interface IReceipt {
  id: number
  receiptNumber: string
  type: IReceiptType
  createdAt: string
  amount: number

  first_name: string
  last_name: string
  customerId: number
  payments: any[]
}

export const fakeReceipts: IReceipt[] = [
  {
    id: 1,
    receiptNumber: 'RECGGH',
    type: 'cash',
    amount: 136,
    first_name: 'Jamal',
    last_name: 'Kerrod',
    createdAt: '10/11/2022',
    customerId: 1,
    payments: [],
  },
]
