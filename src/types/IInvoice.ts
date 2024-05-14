export interface ISalesInvoice {
  id?: number
  invoiceNumber: number
  userId: number
  transactionId: number
  storeId: number
  customerId: number
  paymentType: number
  productId: number
  payment: number
  total: number
  deleted: 0 | 1
  extraNotes: string
  createdAt: string
  quantity: number
  invoiceStatus: IInvoiceStatus
}

export const InvoiceStatus = {
  Due: 0,
  Paid: 1,
  Partial: 2,
  Returned: 3,
} as const

export type IInvoiceStatus =
  (typeof InvoiceStatus)[keyof typeof InvoiceStatus]
