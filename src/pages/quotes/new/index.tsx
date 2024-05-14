import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import QuoteForm from 'src/components/quotes/QuoteForm'
import { useAuth } from 'src/hooks/useAuth'
import { useCreateQuotesMutation } from 'src/store/apis/quotesSlice'
import { useAppSelector } from 'src/store/hooks'
import { buildUrl } from 'src/utils/routeUtils'
import { IData } from 'src/utils/types'

const NewQuotePage = () => {
  const { user } = useAuth()
  const { store } = useAppSelector(state => state.app)

  const [createQuote] = useCreateQuotesMutation()

  const router = useRouter()

  const calculateTotal = (
    products: any,
    delivery: number,
    field: string,
  ) => {
    let total = 0
    let total_discount = 0
    let net_amount = 0
    let vat_amount = 0
    products.forEach((product: any) => {
      const discount = product.discount
      const quantity = product.quantity
      const quotePrice = parseFloat(product.base_price)

      if (!isNaN(quantity) && !isNaN(quotePrice)) {
        total += quantity * quotePrice
        total_discount += discount * quantity
      }
    })
    net_amount =
      total -
      parseFloat((total_discount / 1.2).toFixed(2)) +
      parseFloat((delivery / 1.2).toFixed(2))
    vat_amount = net_amount * 0.2
    switch (field) {
      case 'total':
        return (
          parseFloat(net_amount.toFixed(2)) +
          parseFloat(vat_amount.toFixed(2))
        )
      case 'net':
        return net_amount
      case 'vat':
        return vat_amount
      case 'discount':
        return total_discount
      default:
        return 0
    }
  }

  const calculateQuantity = (products: any) => {
    let total = 0
    products.forEach((product: any) => {
      const quantity = product.quantity
      if (!isNaN(quantity)) {
        total += quantity
      }
    })

    return total
  }

  const _createQuote = (values: IData) => {
    const obj = {
      ...values,
      total: calculateTotal(
        values.sale_quote,
        values.delivery,
        'total',
      ).toFixed(2),
      subtotal: calculateTotal(
        values.sale_quote,
        values.delivery,
        'net',
      ).toFixed(2),
      total_vat: calculateTotal(
        values.sale_quote,
        values.delivery,
        'vat',
      ).toFixed(2),
      total_discount: calculateTotal(
        values.sale_quote,
        values.delivery,
        'discount',
      ).toFixed(2),
      quantity: calculateQuantity(values.sale_quote),
      deleted: false,
      quote_status: 'active',
      store: store?.id,
      user: user?.id,
      verified_by: user?.id,
    }
    createQuote(obj)
      .unwrap()
      .then((response: any) => {
        if ('id' in response) {
          toast.success('Quote created successfully')
          router.push(
            buildUrl('quotes', {
              itemId: response.id,
              mode: 'view',
            }),
          )
        } else {
          toast.error((response as any)?.error)
        }
      })
      .catch(() => toast.error('An error occurred'))
  }

  return (
    <QuoteForm onSubmit={value => _createQuote(value)} />
  )
}

NewQuotePage.acl = {
  action: 'create',
  subject: 'quote',
}

export default NewQuotePage
