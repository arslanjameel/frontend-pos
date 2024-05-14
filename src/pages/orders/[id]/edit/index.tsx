import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'

import OrderForm from 'src/components/orders/OrderForm'
import Error404 from 'src/pages/404'
import { useGetSingleSaleQuery } from 'src/store/apis/SalesSlice'
import { useUpdateOrderMutation } from 'src/store/apis/orderSlice'
import {
  IsResourceNotFound,
  extractErrorMessage,
  getCustomNotFoundError,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'
import { isIdValid } from 'src/utils/routerUtils'

const EditOrderPage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const {
    data: orderData,
    isLoading,
    isError,
  } = useGetSingleSaleQuery(id)
  const [updateOrder] = useUpdateOrderMutation()

  const _updateOrder = (values: any) => {
    updateOrder({ id, body: values })
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Order updated successfully')
          router.push(
            buildUrl('orders', {
              itemId: id,
              mode: 'view',
            }),
          )
        }
      })
      .catch(() => toast.error('An error occurred'))
  }
  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('order')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError || !orderData) return <CustomError404 />

  return IsResourceNotFound(orderData) ? (
    <CustomError404 />
  ) : (
    <OrderForm
      onSubmit={_updateOrder}
      defaultValues={orderData}
    />
  )
}

EditOrderPage.acl = {
  action: 'update',
  subject: 'order',
}

export default EditOrderPage
