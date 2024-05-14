// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import {
  ISaleInvoice,
  ITransaction,
  ProductSoldOn,
} from 'src/models/ISaleInvoice'
import {
  IPayInfo,
  IPayTypes,
  PayTypes,
} from 'src/types/IPayInfo'
import { calculateVAT, excludeVAT } from './dataUtils'

export const getPaymentMethods = (
  invoiceTransaction: ISaleInvoice | ITransaction | any,

  //   options?: { returnAs?: 'paymentDataArr' | 'commaString' },
) => {
  const paid_from_bacs = Number(
    invoiceTransaction?.paid_from_bacs,
  )
  const paid_from_card = Number(
    invoiceTransaction?.paid_from_card,
  )
  const paid_from_cash = Number(
    invoiceTransaction?.paid_from_cash,
  )
  const paid_from_credit = Number(
    invoiceTransaction?.paid_from_credit,
  )

  const _paymentData: IPayInfo[] = []

  if (paid_from_bacs > 0) {
    _paymentData.push({
      id: PayTypes.BACS,
      title: 'BACS',
      amount: paid_from_bacs,
    })
  }
  if (paid_from_card > 0) {
    _paymentData.push({
      id: PayTypes.Card,
      title: 'Card',
      amount: paid_from_card,
    })
  }
  if (paid_from_cash > 0) {
    _paymentData.push({
      id: PayTypes.Cash,
      title: 'Cash',
      amount: paid_from_cash,
    })
  }
  if (paid_from_credit > 0) {
    _paymentData.push({
      id: PayTypes.Credit,
      title: 'Credit',
      amount: paid_from_credit,
    })
  }

  return _paymentData
}

export const getPaymentMethodsStr = (
  paymentData: IPayInfo[],
) => {
  return paymentData.map(_pay => _pay.title).join(', ')
}

export const getPaymentMethodsTotal = (
  paymentData: IPayInfo[],
) => {
  return paymentData.reduce(
    (total, _pay) => total + _pay.amount,
    0,
  )
}

export const getPaymentAmount = (
  payTypeId: IPayTypes,
  paymentData: IPayInfo[],
) => {
  const paymentItem = paymentData.find(
    item => item.id === payTypeId,
  )

  return paymentItem ? paymentItem.amount : 0
}

export const getApiStylePaymentMethods = (
  paymentData: IPayInfo[],
) => {
  const apiStylePaymentMethods = {
    paid_from_bacs: getPaymentAmount(
      PayTypes.BACS,
      paymentData,
    ),
    paid_from_card: getPaymentAmount(
      PayTypes.Card,
      paymentData,
    ),
    paid_from_cash: getPaymentAmount(
      PayTypes.Cash,
      paymentData,
    ),
    paid_from_credit: getPaymentAmount(
      PayTypes.Credit,
      paymentData,
    ),
  }

  return apiStylePaymentMethods
}

export const calculateRowExVAT = (
  prod: any,
  keys?: { unitPriceKey?: string; quantityKey?: string },
) =>
  (Number(prod[keys?.unitPriceKey || 'unit_price']) -
    excludeVAT(Number(prod.discount))) *
  Number(prod[keys?.quantityKey || 'quantity_sold'])

export const calculateInvoiceTotals = (
  products: ProductSoldOn[],
  options: {
    delivery: number
    paymentMade: number
    quantityKey?: string
    unitPriceKey?: string
    discountKey?: string
  },
) => {
  const productTotal = products.reduce(
    (total, product) =>
      total +
      (Number(
        product[options.unitCostKey || 'unit_price'],
      ) -
        (Number(
          product[options.discountKey || 'discount'],
        ) || 0)) *
        Number(
          product[options.quantityKey || 'quantity_sold'],
        ),
    0,
  )

  const productTotalExVAT = products.reduce(
    (total, product) =>
      total +
      calculateRowExVAT(product, {
        quantityKey: options.quantityKey,
        unitPriceKey: options.unitPriceKey,
      }),
    0,
  )

  const deliveryExVAT = excludeVAT(options?.delivery || 0)

  const vatAmount = products.reduce(
    (total, product) =>
      calculateVAT(options?.delivery || 0) +
      total +
      calculateVAT(
        product[options.unitCostKey || 'unit_price'],
      ) *
        (product[options.quantityKey || 'quantity_sold'] ||
          0),
    0,
  )

  const netAmount =
    productTotal +
    (options?.delivery -
      calculateVAT(options?.delivery || 0))

  const netAmountExVAT = productTotalExVAT + deliveryExVAT

  const vatAmountExVAT = calculateVAT(netAmountExVAT)

  const discountTotal = products.reduce(
    (total, product) =>
      total +
      Number(product[options.discountKey || 'discount']) *
        Number(
          product[options.quantityKey || 'quantity_sold'],
        ),
    0,
  )

  const grossAmount = netAmount + vatAmount

  const grossAmountExVAT = netAmountExVAT + vatAmountExVAT

  const amountDue = Math.min(
    grossAmountExVAT,
    grossAmount - options.paymentMade,
  )

  return {
    productTotal,
    productTotalExVAT,
    delivery: options.delivery,
    netAmount,
    netAmountExVAT,
    vatAmount,
    vatAmountExVAT,
    grossAmount,
    amountDue,
    discountTotal,
    deliveryExVAT,
    grossAmountExVAT,
  }

  // const productTotal = productsList.reduce(
  //   (total, product) =>
  //     total +
  //     Number(
  //       product[options?.unitPriceKey || 'unit_price'],
  //     ) *
  //       product[options?.quantityKey || 'quantity_sold'],
  //   0,
  // )

  // const netAmount = productTotal + options.delivery

  // const vatAmount = productsList.reduce(
  //   (total, product) =>
  //     total +
  //     calculateVAT(
  //       product[options?.unitPriceKey || 'unit_price'],
  //     ) *
  //       (product[options?.quantityKey || 'quantity_sold'] ||
  //         0),
  //   0,
  // )

  // const grossAmount = netAmount + vatAmount

  // const amountDue = grossAmount - options.paymentMade

  // return {
  //   productTotal,
  //   delivery: options.delivery,
  //   netAmount,
  //   vatAmount,
  //   grossAmount,
  //   amountDue,
  // }
}

/**
 *
 *
 * Get quote information from local storage
 *
 */

export const getQuoteToInvoiceInfo = (
  callback: (quoteInfo: {
    customer: any
    invoice_to: string
    deliver_to: string
    extra_notes: string
    products: any[]
    customer_reference: string
    quote_reference: ''
    delivery: number
  }) => void,
  failureCallback?: () => void,
) => {
  if (window) {
    const quoteData = window.localStorage.getItem(
      'quoteToInvoice',
    )

    if (quoteData) {
      // window.localStorage.removeItem('quoteToInvoice')
      const parsedData = JSON.parse(quoteData)

      callback({
        ...parsedData,
        products: parsedData.sale_quote,
      })
    } else {
      failureCallback && failureCallback()
    }
  } else {
    failureCallback && failureCallback()
  }
}

/**
 *
 * General function for geting invoice info from local storage
 *
 */

type ToInvoiceCallback = (quoteInfo: {
  customer: any
  invoice_to: string
  deliver_to: string
  extra_notes: string
  products: any[]
  customer_reference: string
  delivery: number
  from?: 'invoice' | 'order' | 'quote'
  orderId?: number
}) => void

export const getItemToInvoiceInfo = (
  callback: ToInvoiceCallback,
  localStorageKey = 'itemToInvoice',
  failureCallback?: () => void,
) => {
  if (window) {
    const quoteData =
      window.localStorage.getItem(localStorageKey)

    if (quoteData) {
      window.localStorage.removeItem(localStorageKey)
      const parsedData = JSON.parse(quoteData)
      callback(parsedData)
    } else {
      failureCallback && failureCallback()
    }
  } else {
    failureCallback && failureCallback()
  }
}

export const getQuoteToInvoiceFromView = (
  callback: ToInvoiceCallback,
  failureCallback?: () => void,
) => {
  getItemToInvoiceInfo(
    callback,
    'quoteToInvoiceFromView',
    failureCallback,
  )
}

export const getItemToInvoice = (
  callback: ToInvoiceCallback,
  failureCallback?: () => void,
) => {
  getItemToInvoiceInfo(
    callback,
    'itemToInvoice',
    failureCallback,
  )
}

export const getOrderToInvoice = (
  callback: ToInvoiceCallback,
  failureCallback?: () => void,
) => {
  getItemToInvoiceInfo(
    callback,
    'orderToInvoice',
    failureCallback,
  )
}

export const getOrderToQuote = (
  callback: ToInvoiceCallback,
  failureCallback?: () => void,
) => {
  if (window) {
    const quoteData =
      window.localStorage.getItem('orderToQuote')

    if (quoteData) {
      window.localStorage.removeItem('orderToQuote')
      const parsedData = JSON.parse(quoteData)
      callback(parsedData)
    } else {
      failureCallback && failureCallback()
    }
  } else {
    failureCallback && failureCallback()
  }
}

export const getInvoicePaidAmount = (
  invoice: ISaleInvoice,
) => {
  try {
    const paymentOptions = getPaymentMethods(invoice)

    const amountPaid = paymentOptions.reduce(
      (total, curr) => total + curr.amount,
      0,
    )

    return amountPaid
  } catch (e) {
    return 0
  }
}

export const getInvoicePaidAndBalance = (
  invoice: ISaleInvoice,
) => {
  const paymentOptions = getPaymentMethods(
    invoice?.transaction,
  )

  const amountPaid = paymentOptions.reduce(
    (total, curr) => total + curr.amount,
    0,
  )

  const amountDue = Number(invoice?.total) - amountPaid

  const hasBalance = amountDue > 0

  return { amountDue, amountPaid, hasBalance }
}
