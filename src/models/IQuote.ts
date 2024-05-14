// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
  customer: any
  invoice_to: number | string
  deliver_to: number | string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQuoteNew {}
