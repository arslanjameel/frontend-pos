import { TStatus } from 'src/components/customers/TransactionStatus'
import { addVAT, excludeVAT, numTo2dp } from './dataUtils'
import { isDateOlderThan30Days } from './dateUtils'

export const isTransactionAReturn = (transaction: any) =>
  Object.keys(transaction).includes('return_number')

export const isTransactionAnInvoice = (transaction: any) =>
  Object.keys(transaction).includes('invoice_number')

export const isTransactionAReceipt = (transaction: any) =>
  Object.keys(transaction).includes('receipt_number')

export const isTransactionAQuote = (transaction: any) =>
  Object.keys(transaction).includes('quote_number')

export const addTransactionInfo = (transactions: any[]) => {
  return transactions.map((transaction: any) => {
    const _transaction = { ...transaction }

    if (isTransactionAReturn(transaction)) {
      _transaction.document = 'Return'
      _transaction.link = `/credit-notes/${transaction.id}/view/`
      _transaction.transaction_number =
        transaction.return_number
      _transaction.status = TStatus.FULLY_PAID
    } else if (isTransactionAnInvoice(transaction)) {
      _transaction.document = 'Invoice'
      _transaction.link = `/invoices/${transaction.id}/view/`
      _transaction.transaction_number =
        transaction.invoice_number

      if (
        isDateOlderThan30Days(transaction?.created_at) &&
        transaction.invoice_status === 'pending'
      ) {
        _transaction.status = TStatus.OUTSTANDING
      } else if (transaction.invoice_status === 'pending') {
        _transaction.status = TStatus.PARTIAL
      } else {
        _transaction.status = TStatus.FULLY_PAID
      }
    } else if (isTransactionAReceipt(transaction)) {
      _transaction.document = 'Receipt'
      _transaction.link = `/receipts/${transaction.id}/view/`
      _transaction.transaction_number =
        transaction.receipt_number
      _transaction.status = TStatus.COMPLETED
    } else if (isTransactionAQuote(transaction)) {
      _transaction.document = 'Quote'
      _transaction.link = `/quotes/${transaction.id}/view/`
      _transaction.transaction_number =
        transaction.quote_number
      _transaction.status = TStatus.COMPLETED
    }

    return _transaction
  })
}

export const getPaidFromAmountsTotal = (
  transactionObj: any,
) => {
  const paid_from_bacs =
    Number(transactionObj.paid_from_bacs) || 0
  const paid_from_card =
    Number(transactionObj.paid_from_card) || 0
  const paid_from_cash =
    Number(transactionObj.paid_from_cash) || 0
  const paid_from_credit =
    Number(transactionObj.paid_from_credit) || 0

  return numTo2dp(
    paid_from_bacs +
      paid_from_card +
      paid_from_cash +
      paid_from_credit,
  )
}

/**
 *
 *
 * Sale Quotes
 *
 */
export const calculateQuoteValue = (
  products: any,
  delivery: number,
  type: string,
) => {
  let total = 0
  products.map((prod: any) => {
    const product_total = Number(
      prod.unit_price * prod.quantity,
    )
    const product_discount =
      Number(prod.discount * prod.quantity) / 1.2
    total += product_total - product_discount
  })
  const net = total + delivery / 1.2
  const vat = net * 0.2
  const gross = net + vat

  switch (type) {
    case 'total':
      return total
    case 'net':
      return net
    case 'vat':
      return vat
    case 'gross':
      return gross
    default:
      return
  }
}

export const addQuotesTotalColumn = (products: any[]) => {
  return products.map(prod => ({
    ...prod,
    discount: excludeVAT(prod.discount),
    total: Number(
      excludeVAT(Number(calculateQuotesTotal(prod))),
    ),
  }))
}

export const calculateQuotesTotal = (data: any) => {
  return (
    (Number(data.unit_price) + addVAT(data.unit_price)) *
      data.quantity -
    data.discount * data.quantity
  )
}

export const calculateProductTableTotal = ({
  rowData,
  unitPriceKey,
  quantityKey,
  discountKey,
}: {
  rowData: any
  unitPriceKey?: string
  quantityKey?: string
  discountKey?: string
}) => {
  return (
    Number(rowData[unitPriceKey || 'unit_price']) *
      1.2 *
      Number(rowData[quantityKey || 'quantity_sold']) -
    Number(rowData[discountKey || 'discount'])
  )
}
