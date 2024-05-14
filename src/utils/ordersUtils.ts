import { getInvoicePaidAndBalance } from './invoicesUtils'

export const getQuoteToOrderInfo = (
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
    const quoteData =
      window.localStorage.getItem('quoteToOrder')

    if (quoteData) {
      window.localStorage.removeItem('quoteToOrder')
      const parsedData = JSON.parse(quoteData)
      callback(parsedData)
    } else {
      failureCallback && failureCallback()
    }
  } else {
    failureCallback && failureCallback()
  }
}

export const getOrderBalance = (orderInfo: any) => {
  if (Boolean(orderInfo?.sale_invoice)) {
    const { amountDue } = getInvoicePaidAndBalance(
      orderInfo?.sale_invoice,
    )

    return amountDue
  }

  return orderInfo.total
}
