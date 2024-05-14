import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import PaymentReceiptsForm from 'src/components/receipts/PaymentReceiptsForm'
import { useAuth } from 'src/hooks/useAuth'
import { customersApi } from 'src/store/apis/customersSlice'
import { invoicesApi } from 'src/store/apis/invoicesSlice'
import { useCreateReceiptMutation } from 'src/store/apis/receiptsSlice'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { IData } from 'src/utils/types'

const NewReceiptPage = () => {
  const { user } = useAuth()
  const { selectedStore } = useAppSelector(
    state => state.app,
  )

  const [createReceipt] = useCreateReceiptMutation()
  const router = useRouter()

  const dispatch = useAppDispatch()

  const handleSubmit = (values: IData) => {
    const obj = {
      ...values,
      user: user?.id,
      store: selectedStore,
      transaction_type: 'receipt',
    }
    createReceipt(obj)
      .unwrap()
      .then((res: any) => {
        toast.success('Receipt created successfully')
        router.push(`/receipts/${res.id}/view`)

        dispatch(
          invoicesApi.util.invalidateTags([
            'SaleInvoiceSearched',
            'SaleInvoice',
          ]),
        )

        dispatch(
          customersApi.util.invalidateTags([
            'Address',
            'Customer',
            'CustomerAddresses',
            'Reference',
            'ReferenceStatus',
            'Receipts',
          ]),
        )
      })
      .catch(() => toast.error('An error occurred'))
  }

  return <PaymentReceiptsForm onSubmit={handleSubmit} />
}

NewReceiptPage.acl = {
  action: 'create',
  subject: 'receipt',
}

export default NewReceiptPage
