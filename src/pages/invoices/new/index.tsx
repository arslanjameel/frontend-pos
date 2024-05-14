import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import InvoiceForm from 'src/components/invoices/InvoiceForm'
import { ISaleInvoiceNew } from 'src/models/ISaleInvoice'
import { useCreateInvoiceMutation } from 'src/store/apis/invoicesSlice'
import { ordersApi } from 'src/store/apis/orderSlice'
import { useAppDispatch } from 'src/store/hooks'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'

const NewInvoicePage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [createSaleInvoice, { isLoading }] =
    useCreateInvoiceMutation()

  const _createInvoice = (values: ISaleInvoiceNew) => {
    createSaleInvoice(values)
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Invoice added successfully')

          const sale_order = values?.sale_order

          if (sale_order) {
            dispatch(
              ordersApi.util.invalidateTags([
                'Search',
                { type: 'Search', id: sale_order },
              ]),
            )
          }

          if (Boolean(values?.sale_order)) {
            router.replace(
              buildUrl('orders', {
                itemId: Number(values?.sale_order),
                mode: 'view',
              }),
            )
          } else {
            router.replace(
              buildUrl('invoices', {
                itemId: Number(res.id),
                mode: 'view',
              }),
            )
          }
        }
      })
      .catch(error => {
        toast.error(extractErrorMessage(error as any))
      })
  }

  return (
    <InvoiceForm
      onSubmit={_createInvoice}
      submitting={isLoading}
    />
  )
}

NewInvoicePage.acl = {
  action: 'create',
  subject: 'invoice',
}

export default NewInvoicePage
