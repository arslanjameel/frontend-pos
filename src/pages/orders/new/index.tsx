import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import OrderForm from 'src/components/orders/OrderForm'

import { IData } from 'src/utils/types'
import { useAuth } from 'src/hooks/useAuth'
import { useAppSelector } from 'src/store/hooks'
import { useCreateOrderMutation } from 'src/store/apis/orderSlice'
import { buildUrl } from 'src/utils/routeUtils'

const NewOrderPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { selectedStore } = useAppSelector(
    (state: any) => state.app,
  )
  const [createOrder] = useCreateOrderMutation()

  const _createOrder = (values: IData) => {
    const obj = {
      ...values,
      deleted: false,
      store: selectedStore,
      user: user?.id,
    }
    createOrder(obj)
      .unwrap()
      .then(response => {
        if ('id' in response) {
          toast.success('Order created successfully')
          router.push(
            buildUrl('orders', {
              itemId: response.id,
              mode: 'view',
            }),
          )
        } else {
          toast.error((response as any)?.error)
        }
      })
      .catch(() => toast.error('An error occured'))
  }

  return (
    <OrderForm onSubmit={value => _createOrder(value)} />
  )
}

NewOrderPage.acl = {
  action: 'create',
  subject: 'order',
}

export default NewOrderPage
