export type IQuoteStatus = 0 | 1

export interface IQuote {
  id: number
  quoteNumber: string
  total: number
  first_name: string
  last_name: string
  expiryDate: string
  createdAt: string

  user: string
  customerId: number
  invoiceAddress: number
  deliveryAddress: number
  deliveryCost: number
  customerNotes: string
  products: any[]
}

export const fakeQuotes: IQuote[] = [
  {
    id: 1,
    quoteNumber: 'QN1',
    total: 136,
    first_name: 'Jamal',
    last_name: 'Kerrod',
    expiryDate: '09/10/2023',
    createdAt: '10/11/2022',
    user: 'Johny Doe',

    customerId: 1,
    invoiceAddress: 1,
    deliveryAddress: 1,
    deliveryCost: 10,
    customerNotes: 'Customer Notes',
    products: [
      {
        id: 1,
        productStatus: 1,
        sku: 'JHSGHSG',
        productName: 'Zonda Lin',
        priceBand: 'C',
        quantity: 2,
        total: 102,
        unitPrice: 102,
        internalNotes: '',
      },
    ],
  },
]

export interface IQuoteNew {
  id: number
  quoteNumber: number
  userId: number
  storeId: number
  customerId: number
  customerReference: number
  productId: number
  total: number
  deleted: 0 | 1
  extraNotes: string
  quantity: number
  quoteStatus: IQuoteStatus
  expiryDate: string
  createdAt: string
  profitMargin: number
  percentageMargin: number
  quoteReference: string
  verifiedBy?: number
}
