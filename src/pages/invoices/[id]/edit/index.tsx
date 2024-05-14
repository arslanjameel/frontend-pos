import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import FallbackSpinner from 'src/@core/components/spinner'
import InvoiceForm from 'src/components/invoices/InvoiceForm'
import { ISaleInvoiceNew } from 'src/models/ISaleInvoice'
import Error404 from 'src/pages/404'
import {
  useGetSingleInvoiceQuery,
  useUpdateInvoiceMutation,
} from 'src/store/apis/invoicesSlice'
import {
  IsResourceNotFound,
  extractErrorMessage,
  getCustomNotFoundError,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'
import { isIdValid } from 'src/utils/routerUtils'

const EditInvoicePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetSingleInvoiceQuery(id)
  const [updateSaleInvoice] = useUpdateInvoiceMutation()

  const _updateInvoice = (values: ISaleInvoiceNew) => {
    updateSaleInvoice({ id, body: values })
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Invoice update successfully')
          router.replace(buildUrl('invoices'))
        }
      })
      .catch(() => toast.error('An error occurred'))
  }
  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('invoice')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError || !invoiceData) return <CustomError404 />

  return IsResourceNotFound(invoiceData) ? (
    <CustomError404 />
  ) : (
    <InvoiceForm
      onSubmit={_updateInvoice}
      defaultValues={invoiceData}
    />
  )
}

EditInvoicePage.acl = {
  action: 'update',
  subject: 'invoice',
}

export default EditInvoicePage
