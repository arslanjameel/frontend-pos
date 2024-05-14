import { dateToString } from 'src/utils/dateUtils'

export interface ICustomer {
  id: number
  name?: string
  last_name: string
  first_name: string
  email: string
  mobile: string
  address: string
  role: string
  status: 0 | 1
  spendToDate: number
  accBalance: number
  balanceStatus: 0 | 1 | 2
  priceBand: 'A' | 'B' | 'C'
}

export const getCustomerById = (id: number): ICustomer => {
  const customer = fakeCustomers.find(_c => _c.id === id)
  if (customer) {
    return {
      ...customer,
      name: customer.first_name + ' ' + customer.last_name,
    }
  }

  return {
    id: 1,
    name: 'Jon Snow',
    last_name: 'Snow',
    first_name: 'Jon',
    email: 'john.doe@gmail.com',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 2,
    priceBand: 'B',
  }
}

export const fakeCustomers: ICustomer[] = [
  {
    id: 1,
    last_name: 'Snow',
    first_name: 'Jon',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 2,
    priceBand: 'B',
  },
  {
    id: 2,
    last_name: 'Lannister',
    first_name: 'Cersei',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 1,
    priceBand: 'A',
  },
  {
    id: 3,
    last_name: 'Lannister',
    first_name: 'Jaime',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 1,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 1,
    priceBand: 'C',
  },
  {
    id: 4,
    last_name: 'Stark',
    first_name: 'Arya',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 0,
    priceBand: 'C',
  },
  {
    id: 5,
    last_name: 'Targaryen',
    first_name: 'Daenerys',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 0,
    priceBand: 'C',
  },
  {
    id: 6,
    last_name: 'Melisandre',
    first_name: '',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 0,
    priceBand: 'C',
  },
  {
    id: 7,
    last_name: 'Clifford',
    first_name: 'Ferrara',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 0,
    priceBand: 'C',
  },
  {
    id: 8,
    last_name: 'Frances',
    first_name: 'Rossini',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 2,
    priceBand: 'C',
  },
  {
    id: 9,
    last_name: 'Roxie',
    first_name: 'Harvey',
    mobile: '071235456789',
    email: 'john.doe@gmail.com',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    spendToDate: 1230,
    accBalance: 1230,
    balanceStatus: 0,
    priceBand: 'C',
  },
]

/**
 *
 *
 */

export type ICustomerNew = {
  id: number
  first_name: string
  last_name: string
  accountName: string
  email: string
  status: 0 | 1
  accBalance: number
  balanceStatus: 0 | 1 | 2
  address: string
  primaryPhone: string
  secondPhone: string
  priceBand: 'A' | 'B' | 'C'
  creditLimit: number
  deleted: number
  image: string
  createdBy: number
  business: number
  createdAt: string
  role: string
  spendToDate: number
}

export const fakeCustomersData: ICustomerNew[] = [
  {
    id: 1,
    first_name: 'George',
    last_name: 'Elvis',
    accountName: 'Tad Petersen',
    email: 'ali.lobortis@outlook.couk',
    address: 'Lake Chelsie, Utah, United States',
    status: 0,
    primaryPhone: '076 3211 3032',
    secondPhone: '0933 845 6317',
    priceBand: 'C',
    creditLimit: 10611,
    deleted: 0,
    image: 'https://imgur.com/L3eMDL2.jpeg',
    createdBy: 2,
    business: 0,
    createdAt: '8/04/2023',
    role: 'Trial',
    spendToDate: 966,
    balanceStatus: 2,
    accBalance: 1230,
  },
  {
    id: 2,
    first_name: 'Garrison',
    last_name: 'Mccall',
    accountName: 'Ethan Whitfield',
    email: 'ut@icloud.edu',
    address: 'Lake Chelsie, Utah, United States',
    status: 0,
    primaryPhone: '070 6844 2744',
    secondPhone: '(025) 5371 5346',
    priceBand: 'B',
    creditLimit: 11424,
    deleted: 0,
    image: 'https://imgur.com/L3eMDL2.jpeg',
    createdBy: 1,
    business: 0,
    createdAt: '8/04/2023',
    role: 'Trial',
    spendToDate: 757,
    balanceStatus: 2,
    accBalance: 1230,
  },
]

/**
 *
 *
 * Outstanding Transactions
 *
 */

export interface IOutstandingTransaction {
  id: number
  date: string
  document: string
  transactionId: string
  debit: number
  credit: number
  available: number
}

export const fakeOutstandingTransactions: IOutstandingTransaction[] =
  [
    {
      id: 1,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 2,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 3,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 11,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 21,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 31,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 111,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 23,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 193,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 9931,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 11211,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 2223,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
    {
      id: 19123,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      debit: 1644.32,
      credit: 1644.32,
      available: 0,
    },
  ]

/**
 *
 * Comments data
 */

export interface IComment {
  id: number
  senderName: string
  comment: string
  date: string
}

export const fakeComments: IComment[] = [
  {
    id: 1,
    senderName: 'Jordan',
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    date: 'Today 11:00',
  },
  {
    id: 2,
    senderName: 'Dianna',
    comment:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    date: 'Today 10:00',
  },
]

/**
 *
 *
 * detailed transaction
 *
 */

export interface IDetailedTransaction {
  id: number
  date: string
  document: string
  transactionId: string
  amount: number
  status: 0 | 1 | 2 | 3
}

export const fakeDetailedTransactions: IDetailedTransaction[] =
  [
    {
      id: 1,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      amount: 16843,
      status: 3,
    },
    {
      id: 2,
      date: '16 Mar, 2023',
      document: 'Credit Note',
      transactionId: 'ALSDUJ51',
      amount: 16843,
      status: 2,
    },
    {
      id: 3,
      date: '16 Mar, 2023',
      document: 'Invoice',
      transactionId: 'ALSDUJ51',
      amount: 16843,
      status: 1,
    },
  ]

/**
 *
 *
 * Statements data
 *
 */

export interface IStatement {
  id: number
  statementId: number
  createdDate: string
  emailStatus: 0 | 1
  totalAmount: number
}

export const fakeStatements: IStatement[] = [
  {
    id: 1,
    statementId: 263552326,
    createdDate: '7 July, 2023',
    emailStatus: 1,
    totalAmount: 23121,
  },
  {
    id: 2,
    statementId: 26552326,
    createdDate: '7 July, 2023',
    emailStatus: 0,
    totalAmount: 23121,
  },
  {
    id: 3,
    statementId: 2632326,
    createdDate: '7 July, 2023',
    emailStatus: 1,
    totalAmount: 23121,
  },
]

/**
 *
 *
 * References Data
 *
 */

export interface IReference {
  id: number
  referenceCompanyName: string
  referenceCompanyNumber: string
  referenceCreditLimit: number
  yearsTrading: number
  referenceContactName: string
  referenceContactNumber: string
  deleted: 0 | 1
  createdAt: string

  /**
   * Reference Status
   */
  verificationStatus?: 0 | 1
  verifiedBy?: string
  verificationDate?: string
}

export const fakeReferences: IReference[] = [
  {
    id: 1,
    referenceCompanyName: '',
    referenceCompanyNumber: '',
    referenceCreditLimit: 0,
    yearsTrading: 0,
    referenceContactName: '',
    referenceContactNumber: '',
    deleted: 0,
    createdAt: '',
    verificationStatus: 1,
    verifiedBy: 'John',
    verificationDate: dateToString(new Date()),
  },
  {
    id: 2,
    referenceCompanyName: '',
    referenceCompanyNumber: '',
    referenceCreditLimit: 0,
    yearsTrading: 0,
    referenceContactName: '',
    referenceContactNumber: '',
    deleted: 0,
    createdAt: '',
    verificationStatus: 0,
    verifiedBy: '',
    verificationDate: dateToString(new Date()),
  },
  {
    id: 3,
    referenceCompanyName: '',
    referenceCompanyNumber: '',
    referenceCreditLimit: 0,
    yearsTrading: 0,
    referenceContactName: '',
    referenceContactNumber: '',
    deleted: 0,
    createdAt: '',
    verificationStatus: 0,
    verifiedBy: '',
    verificationDate: dateToString(new Date()),
  },
]

export interface IOutstanding {
  id: number
  name: string
  months: {
    label: string
    value: number
  }[]
}

export const fakeMonthlyOutstanding: IOutstanding[] = [
  {
    id: 1,
    name: 'Aryan',
    months: [
      { label: 'AUG 23', value: 27126 },
      { label: 'JUL 23', value: 27126 },
    ],
  },
]
