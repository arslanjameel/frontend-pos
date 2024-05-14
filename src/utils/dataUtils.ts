import { IUserWithID } from 'src/models/IUser'
import { IPayInfo } from 'src/types/IPayInfo'
import { UserType } from 'src/types/UserTypes'
import capitalize from './capitalize'
import {
  IQuoteProduct,
  ISaleProduct,
} from 'src/models/IProduct'
import { formatCurrency } from './formatCurrency'
import ICountry from 'src/models/shared/ICountry'

export const getFullName = (data: any) => {
  const firstName =
    data?.first_name || data?.firstName || '--'
  const lastName = data?.last_name || data?.lastName || '--'

  return capitalize(`${firstName} ${lastName}`)
}

export const getRoleName = (data: any, roleId: number) =>
  capitalize(
    data.find((r: { id: number }) => r.id === roleId)
      ?.type || '--',
  )

export const getCountryName = (
  id: number,
  countries?: ICountry[],
) => {
  if (countries) {
    const _country = countries.find(c => c.id === id)

    return _country ? _country.name : '--'
  }

  return '--'
}

export const generateID = () =>
  Math.floor(1000 + Math.random() * 9000)

/**
 *
 *
 * Calculate Gross, NET, VAT
 *
 */

export interface ITotalsData {
  net: number
  vat: number
  sub: number
  gross: number
}

export const calculateNet = (products: any[]) => {
  let total = 0
  products &&
    products.forEach(product => {
      total += product.total
    })

  return total
}

export const calculateVAT = (value: number) => {
  return numTo2dp(value * 0.2)
}

export const addVAT = (value: number) => {
  return numTo2dp(value * 0.2)
}

export const includeVAT = (value: number) => {
  return value * 1.2
}
export const excludeVAT = (value: number) => {
  return value / 1.2
}

export const removeVAT = (value: number) => {
  return numTo2dp(value / 0.2)
}

export const calculateGross = (
  products: any[],
  {
    discount,
    delivery,
    restockingFee,
  }: {
    discount?: number
    delivery?: number
    restockingFee?: number
  },
): ITotalsData => {
  const net = calculateNet(products)

  const vat = addVAT(net)

  const sub = net + vat

  const gross =
    sub +
    (delivery || 0) -
    (discount || 0) -
    (restockingFee || 0)

  return { net, vat, sub, gross }
}

export const getAmountDue = (
  _total: number,
  _paymentData: IPayInfo[],
) => {
  let amountDue = _total
  _paymentData.forEach(pd => {
    amountDue -= pd.amount || 0
  })

  return amountDue
}

export const getQuoteTotalDiscount = (
  products: IQuoteProduct[],
) => {
  let totalDiscount = 0
  products.forEach(product => {
    totalDiscount +=
      (Number(product.discount) || 0) *
      Number(product?.quantity || 0)
  })

  return totalDiscount
}

export const getInvoiceTotalDiscount = (
  products: ISaleProduct[],
) => {
  let totalDiscount = 0
  products.forEach(product => {
    totalDiscount +=
      (Number(product.discount) || 0) *
      Number(product?.quantity_sold || 0)
  })

  return totalDiscount
}

/**
 *
 * Remove SuperAdmins from list
 * @param users IUserWithID[]
 *
 * @returns IUserWithID[]
 *
 */

export const filterSuperAdmins = (users: IUserWithID[]) => {
  return users.filter(
    user =>
      user.user_type &&
      Number(user.user_type) !== UserType.SUPER_ADMIN,
  )
}

export const numTo2dp = (value: number | string) => {
  return parseFloat(Number(value).toFixed(2))
}

export const formatTo2dp = (inputString: string) => {
  const numberValue = parseFloat(inputString)

  if (isNaN(numberValue)) return '0'

  const formattedNumber = numberValue.toFixed(2)

  return formattedNumber
}

export interface IInvoiceTotals {
  gross: number
  totalDiscount: number
  subTotal: number
  vat: number
  netTotal: number

  total: number
}

export const calculateInvoiceTotals = (
  products: any[],
  options: { delivery?: number } = { delivery: 0 },
) => {
  const gross = products.reduce(
    (total, product) => total + (product.total || 0),
    0,
  )

  const totalDiscount = products.reduce(
    (_totalDiscount, product) =>
      _totalDiscount + (product.discount || 0),
    0,
  )

  const vat = addVAT(gross)

  const subTotal = gross //+ vat

  const netTotal =
    subTotal + (options.delivery || 0) - totalDiscount

  const total = netTotal + vat

  return {
    gross,
    totalDiscount,
    subTotal,
    vat,
    netTotal,
    total,
  }
}

/**
 * Generates a formatted string based on an array of payment options.
 *
 * @param {IPayInfo[]} paymentData  The array of payment options.
 * @returns {string} A formatted string describing the transactions.
 */
export const getPaymentMessage = (
  paymentData: IPayInfo[],
): string => {
  if (paymentData.length === 0) {
    return ''
  }

  let result = paymentData
    .map(
      transaction =>
        `${formatCurrency(transaction.amount)} in ${
          transaction.title
        }`,
    )
    .join(', ')

  if (paymentData.length > 1) {
    const lastCommaIndex = result.lastIndexOf(', ')
    result =
      result.substring(0, lastCommaIndex) +
      ' and' +
      result.substring(lastCommaIndex + 1)
  }

  return result
}

export const addIndex = (listData: any[]) => {
  return listData.map((data, i) => ({
    ...data,
    index: i + 1,
  }))
}
