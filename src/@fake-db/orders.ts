import { IOrderStatus } from 'src/types/IOrder'

export interface IOrder {
  id?: number
  orderStatus: IOrderStatus
  createdAt: string
  payment: number

  first_name: string
  last_name: string
  role: string

  orderNumber?: string
  customerId?: number

  deliveryAddress: number
  invoiceAddress: number
  products: number[]
  customerNotes: string

  // transactionId: number
  // storeId: number
  // customerId: number
  // paymentType: number
  // productId: number
  // total: number
  // deleted: 0 | 1
  // extraNotes: string
}

export const fakeSalesOrders: IOrder[] = [
  {
    id: 1,
    orderStatus: 0,
    orderNumber: 'BB123',
    createdAt: '17/02/2023',
    payment: 3077,
    first_name: 'George',
    last_name: 'Elvis',
    customerId: 1,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    products: [1],
    customerNotes: '',
  },
  {
    id: 2,
    orderStatus: 2,
    orderNumber: 'BB124',
    createdAt: '17/10/2023',
    payment: 3077,
    first_name: 'Garrison',
    last_name: 'Mccall',
    customerId: 2,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    products: [1],
    customerNotes: '',
  },
  {
    id: 3,
    orderStatus: 1,
    orderNumber: 'BB125',
    createdAt: '17/10/2023',
    payment: 3077,
    first_name: 'Ayers',
    last_name: 'Rowland',
    customerId: 3,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    products: [1],
    customerNotes: '',
  },
  {
    id: 4,
    orderStatus: 3,
    orderNumber: 'BB126',
    createdAt: '17/10/2023',
    payment: 3077,
    first_name: 'Alexander',
    last_name: 'Trujillo',
    customerId: 4,
    role: 'Software Development',
    invoiceAddress: 1,
    deliveryAddress: 1,
    products: [1],
    customerNotes: '',
  },
]
