import { IInvoiceStatus } from 'src/types/IInvoice'

export interface IInvoice {
  id?: number
  invoiceStatus: IInvoiceStatus
  createdAt: string
  payment: number

  first_name: string
  last_name: string
  role: string

  invoiceNumber?: string
  customerId?: number
  products?: any[]

  invoiceAddress: number
  deliveryAddress: number

  customerNotes?: string

  // transactionId: number
  // storeId: number
  // customerId: number
  // paymentType: number
  // productId: number
  // total: number
  // deleted: 0 | 1
  // extraNotes: string
}

export const fakeSalesInvoices: IInvoice[] = [
  {
    id: 1,
    invoiceStatus: 0,
    invoiceNumber: 'BB123',
    createdAt: '17/02/2023',
    payment: 3077,
    first_name: 'George',
    last_name: 'Elvis',
    customerId: 1,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    customerNotes: '',
    products: [
      {
        id: 1,
        productStatus: 1,
        sku: 'SUHGSS',
        productName: 'Zonda Lin Flanage Membrane 600',
        priceBand: 'C',
        quantity: 3,
        total: 20,
        unitPrice: 20,
        internalNotes: '',
      },
    ],
  },
  {
    id: 2,
    invoiceStatus: 2,
    invoiceNumber: 'BB124',
    createdAt: '17/10/2023',
    payment: 3077,
    first_name: 'Garrison',
    last_name: 'Mccall',
    customerId: 2,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    customerNotes: '',
    products: [
      {
        id: 1,
        productStatus: 1,
        sku: 'SUHGSS',
        productName: 'Zonda Lin Flanage Membrane 600',
        priceBand: 'C',
        quantity: 4,
        total: 20,
        unitPrice: 20,
        internalNotes: '',
      },
    ],
  },
]
