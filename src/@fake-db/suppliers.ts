export interface ISupplier {
  id: number
  name: string
  address: string
  primaryPhone: string
  secondaryPhone?: string
  spendToDate: number
  accBalance: number
}

export interface ISupplierNew {
  id?: number
  name: string
  email: string
  address: string
  primaryPhone: string
  secondaryPhone?: string
  spendToDate: number
  accBalance: number

  currentCredit: number
  creditLimit: number
  openingHrs: string
  closingHrs: string
  daysOfWeek?: number[]
  addressLine?: string //!legacy
  addressLine1?: string
  addressLine2?: string
  city: string
  postCode: string
  country: number
  companyNumber: string
  vatNumber: string
  bankAccName: string
  accNumber: number
  sortCode: string
}

export const fakeSuppliersData: ISupplierNew[] = [
  {
    id: 5089,
    name: 'Jamal Kerrod',
    address: 'Lake Chelsie, Utah, United States',
    primaryPhone: '0737266325',
    email: 'johnyboy@gmail.com',
    spendToDate: 1832,
    accBalance: 1832,

    currentCredit: 10,
    creditLimit: 10,
    openingHrs: '19:12',
    closingHrs: '19:12',
    daysOfWeek: [1, 2],
    addressLine1: 'My Address 1',
    addressLine2: 'My Address 2',
    city: 'Utah',
    postCode: '27363',
    country: 1,
    companyNumber: 'UYWD32Y',
    vatNumber: '32323',
    bankAccName: 'IM BANK',
    accNumber: 7327632,
    sortCode: 'TUYW23Q',
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
