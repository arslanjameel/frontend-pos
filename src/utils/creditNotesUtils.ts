import { ISaleReturn } from 'src/models/ISaleReturn'
import { getPaymentMessage, numTo2dp } from './dataUtils'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'

export const calculateCRNetAmount = (totalamount: any) => {
  const calculatedProductTotal = (
    totalamount.return_on || []
  ).reduce(
    (accumulator: any, product: any) =>
      accumulator +
      (parseFloat(product.unit_price) || 0) *
        (product.quantity_returned || 0),
    0,
  )

  return calculatedProductTotal
}

export const calculateCRTotals = (
  creditNote: ISaleReturn,
  invoicePaidAmount: number = Number.MAX_VALUE,
) => {
  const net = calculateCRNetAmount(creditNote)
  const vat = numTo2dp(net * 0.2)
  const subtotal = net + vat
  const gross =
    Math.min(subtotal, invoicePaidAmount) -
    Number(creditNote?.total_restocking_fee || 0)

  return {
    net,
    vat,
    subtotal,
    gross,
  }
}

export const getUpdatedPaymentData = (
  _amountDue: number,
  _paymentData: IPayInfo[],
  isCashCustomer: boolean,
) => {
  let tempPaymentData = [..._paymentData]

  if (_amountDue > 0 && !isCashCustomer) {
    if (
      !tempPaymentData
        .map(pay => pay.id)
        .includes(PayTypes.Credit)
    ) {
      tempPaymentData.push({
        id: PayTypes.Credit,
        amount: 0,
        title: 'Credit',
      })
    }

    tempPaymentData = tempPaymentData.map(pay =>
      pay.id === PayTypes.Credit
        ? {
            ...pay,
            amount: pay.amount + _amountDue,
          }
        : pay,
    )
  }

  return tempPaymentData
}

export const getConfirmationMessage = (
  _amountDue: number,
  _paymentData: IPayInfo[],
  isCashCustomer: boolean,
) => {
  const tempPaymentData = getUpdatedPaymentData(
    _amountDue,
    _paymentData,
    isCashCustomer,
  )

  return getPaymentMessage(tempPaymentData)
}
