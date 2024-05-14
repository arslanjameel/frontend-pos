type PayTypes = 'cash' | 'card'
export interface ICreditNote {
  id: number
  creditNoteNumber: string
  type: PayTypes[]
  amount: number

  first_name: string
  last_name: string
  customerId: number

  returnDate: string
  verifiedBy: string

  products: number[]
}

export const fakeCreditNotes: ICreditNote[] = [
  {
    id: 1,
    creditNoteNumber: 'CNBB6327',
    amount: 136,
    first_name: 'Jamal',
    last_name: 'Kerrod',
    customerId: 1,
    returnDate: '09/10/2022',
    type: ['cash'],
    verifiedBy: 'Johny Doe',
    products: [1],
  },
  {
    id: 2,
    creditNoteNumber: 'CNBB6328',
    amount: 136,
    first_name: 'Jamal2',
    last_name: 'Kerrod2',
    customerId: 2,
    returnDate: '09/10/2023',
    type: ['cash', 'card'],
    verifiedBy: 'Johny Doe',
    products: [1],
  },
]

// export interface IQuoteNew {
//   id: number
//   quoteNumber: number
//   userId: number
//   storeId: number
//   customerId: number
//   customerReference: number
//   productId: number
//   total: number
//   deleted: 0 | 1
//   extraNotes: string
//   quantity: number
//   quoteStatus: IQuoteStatus
//   expiryDate: string
//   createdAt: string
//   profitMargin: number
//   percentageMargin: number
//   quoteReference: string
//   verifiedBy?: number
// }
