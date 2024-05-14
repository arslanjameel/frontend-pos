import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import PaymentReceiptsForm from 'src/components/receipts/PaymentReceiptsForm'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { updateReceipt } from 'src/store/reducers/receiptsSlice'
import { isIdValid } from 'src/utils/routerUtils'
import { IData } from 'src/utils/types'

const EditReceiptPage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const receiptData = useAppSelector(state =>
    state.receipts.receipts.find(
      receipt => receipt.id === id,
    ),
  )

  const dispatch = useAppDispatch()

  const handleSubmit = (values: IData) => {
    toast.success('Receipt updated successfully')

    //@ts-ignore //TODO: update this
    dispatch(updateReceipt({ ...values }))
    router.replace('/receipts')
  }

  return (
    <PaymentReceiptsForm
      onSubmit={handleSubmit}
      defaultValues={receiptData}
    />
  )
}

export default EditReceiptPage
