import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import CreditNotesForm from 'src/components/credit-notes/CreditNoteForm'
import { useCreateSalereturnMutation } from 'src/store/apis/SalesSlice'
import { IData } from 'src/utils/types'
import { useAuth } from 'src/hooks/useAuth'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { invoicesApi } from 'src/store/apis/invoicesSlice'
import { customersApi } from 'src/store/apis/customersSlice'

const NewCreditNotePage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { selectedStore } = useAppSelector(
    state => state.app,
  )
  const [createCreditNote] = useCreateSalereturnMutation()

  const dispatch = useAppDispatch()

  const invalidateInvoices = () => {
    dispatch(
      invoicesApi.util.invalidateTags([
        'SaleInvoice',
        'SaleInvoiceSearched',
      ]),
    )
  }

  const invalidateCustomerInfo = () => {
    dispatch(
      customersApi.util.invalidateTags([
        'Address',
        'Customer',
        'CustomerAddresses',
        'Reference',
        'ReferenceStatus',
      ]),
    )
  }

  const _createCreditNote = (values: IData) => {
    const obj = {
      ...values,
      deleted: false,
      store: selectedStore,
      user: user?.id,
    }

    createCreditNote(obj)
      .unwrap()
      .then(response => {
        if ('id' in response) {
          toast.success('Credit Note created successfully')
          router.push(`/credit-notes/${response.id}/view`)

          invalidateInvoices()
          invalidateCustomerInfo()
        } else {
          toast.error((response as any)?.error)
        }
      })

      .catch(error => {
        console.error('Error:', error)
        toast.error('An error occurred')
      })
  }

  return (
    <CreditNotesForm
      onSubmit={value => _createCreditNote(value)}
    />
  )
}

NewCreditNotePage.acl = {
  action: 'create',
  subject: 'credit-note',
}

export default NewCreditNotePage
