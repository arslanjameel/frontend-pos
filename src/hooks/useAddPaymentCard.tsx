import { useState, useEffect } from 'react'

import AddPaymentCard from 'src/components/invoices/AddPaymentCard'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'
import { ITotalsData } from 'src/utils/dataUtils'

export function useAddPaymentCard(
  totalsData: ITotalsData,
  selectedProducts: any[],
  selectedCustomer: any,
) {
  const [totalAmount, setTotalAmount] = useState<any[]>([])
  const [customerCredit, setcustomercredit] = useState(0)

  useEffect(() => {
    const updatedTotals = selectedProducts.map(product => {
      const update = { ...product }
      update.total = Number(update.total)

      return update
    })
    setTotalAmount(updatedTotals)
    setcustomercredit(selectedCustomer?.currentCredit)
  }, [selectedProducts, selectedCustomer])

  const [paymentData, setPaymentData] = useState<
    IPayInfo[]
  >([
    {
      id: PayTypes.Cash,
      title: 'Cash',
      amount: 0,
    },
  ])

  const totals = (array: any) => {
    const arr: any[] = []
    array &&
      array.map((e: { transaction: { payable: any } }) => {
        arr.push(Number(e.transaction.payable))
      })

    return arr
  }

  const PaymentCard = () => (
    <AddPaymentCard
      paymentData={paymentData}
      totalAmount={totals(totalAmount)}
      onChange={values => setPaymentData(values)}
      customercredit={customerCredit}
    />
  )

  return { paymentData, setPaymentData, PaymentCard }
}
