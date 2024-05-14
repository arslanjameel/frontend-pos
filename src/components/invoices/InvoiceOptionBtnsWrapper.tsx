import { Card } from '@mui/material'
import React from 'react'
import InvoiceOptionBtns from './InvoiceOptionBtns'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { useRouter } from 'next/router'
import { buildUrl } from 'src/utils/routeUtils'
import { downloadPDF, emailPDF } from 'src/utils/pdfUtils'
import toast from 'react-hot-toast'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { EMAIL_INVOICE_BODY } from 'src/utils/globalConstants'
import EmailCustomerModal from '../customers/EmailCustomerModal'
import { ICustomer } from 'src/models/ICustomer'
import { useModal } from 'src/hooks/useModal'
import { useAppSelector } from 'src/store/hooks'
import useGetInvoicePDFInfo from 'src/hooks/useGetInvoicePDFInfo'
import { getFullName } from 'src/utils/dataUtils'
import { dateToString } from 'src/utils/dateUtils'
import PreviewCard from '../global/PreviewCard'
import AppModal from '../global/AppModal'
import {
  getInvoicePaidAndBalance,
  getPaymentMethods,
} from 'src/utils/invoicesUtils'

interface Props {
  invoiceInfo?: ISaleInvoice
  customerInfo?: ICustomer
  invoicedProducts: any[]
}

const InvoiceOptionBtnsWrapper = ({
  invoiceInfo,
  customerInfo,
  invoicedProducts,
}: Props) => {
  const { store } = useAppSelector(state => state.app)
  const router = useRouter()

  const getInvoicePaymentOption = () => {
    return invoiceInfo
      ? getPaymentMethods(invoiceInfo)
          .map(p => p.title)
          .join(', ') || 'To Pay'
      : 'To Pay'
  }

  const { invoiceDoc, invoiceTopInfo, totals } =
    useGetInvoicePDFInfo({
      customerInfo: customerInfo,
      invoiceInfo: invoiceInfo,
      invoicedProducts: invoicedProducts || [],
    })

  const {
    // openModal: openPreviewInvoiceModal,
    closeModal: closePreviewInvoiceModal,
    isModalOpen: previewInvoiceModalStatus,
  } = useModal<any>()

  const {
    openModal: openEmailCustomerModal,
    closeModal: closeEmailCustomerModal,
    isModalOpen: emailCustomerModalStatus,
  } = useModal<any>()

  const addInvoicePayment = () => {
    const data = {
      customer: customerInfo,

      // products: invoicedProducts,
      // paidAmount: Number(invoiceInfo?.payment) || 0,
      // amountDue: invoiceInfo?.transaction.payable || 0,
      // invoice_number: invoiceInfo?.invoice_number,
      invoices: [invoiceInfo?.id],
    }

    if (window) {
      window.localStorage.setItem(
        'addInvoicePayment',
        JSON.stringify(data),
      )
      router.push(buildUrl('receipts', { mode: 'new' }))
    }
  }

  const addReturnAction = () => {
    const data = {
      invoiceId: invoiceInfo?.id,
      invoice: invoiceInfo,
    }

    if (window) {
      window.localStorage.setItem(
        'addReturn',
        JSON.stringify(data),
      )
      router.push(buildUrl('credit-notes', { mode: 'new' }))
    }
  }

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = customerInfo?.email,
  ) => {
    const invoiceTitle =
      'Invoice ' + invoiceInfo?.invoice_number || ''
    if (store) {
      if (customerInfo) {
        const emailInfo = {
          email: emailTo || '',
          email_title: invoiceTitle,
          email_body: EMAIL_INVOICE_BODY,
          store_id: store?.id,
        }

        if (action === 'email') {
          emailPDF(invoiceDoc, emailInfo, invoiceTitle)
            .then(res => {
              if (hasErrorKey(res as any)) {
                toast.error(extractErrorMessage(res as any))
              } else {
                toast.success('Email sent successfully')
              }
            })
            .catch(err => {
              toast.error(extractErrorMessage(err as any))
            })
        } else {
          downloadPDF(invoiceDoc, invoiceTitle)
        }
      }
    } else {
      toast.error('Select a store')
    }
  }

  const sendEmailAction = () => {
    // pdfAction('email')
    openEmailCustomerModal('')
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailCustomerModal()
    pdfAction('email', values.email)
  }

  const downloadAction = () => {
    pdfAction('download')
  }

  return (
    <>
      <Card sx={{ p: 3, flex: 1 }}>
        <InvoiceOptionBtns
          amountDue={Number(
            invoiceInfo
              ? getInvoicePaidAndBalance(invoiceInfo)
                  .amountDue
              : 0,
          )}
          editAction={() =>
            invoiceInfo
              ? router.push(
                  buildUrl('invoices', {
                    itemId: invoiceInfo?.id,
                    mode: 'edit',
                  }),
                )
              : toast.error('Could not get invoice id')
          }
          emailBtnAction={sendEmailAction}
          downloadAction={downloadAction}
          addPaymentAction={addInvoicePayment}
          returnAction={addReturnAction}
        />
      </Card>

      <EmailCustomerModal
        data={{
          email: customerInfo?.email || '',
          customerName: getFullName(customerInfo) || '',
          documentDate: dateToString(
            new Date(invoiceInfo?.created_at || ''),
          ),
          documentId: invoiceInfo?.invoice_number || '',
          documentType: 'Invoice',
        }}
        onSubmit={confirmSendEmail}
        open={emailCustomerModalStatus()}
        handleClose={closeEmailCustomerModal}
      />

      <AppModal
        maxWidth={900}
        open={previewInvoiceModalStatus()}
        handleClose={closePreviewInvoiceModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          allowPrint
          allowEmail
          title={`Invoice ${invoiceInfo?.invoice_number}`}
          invoiceInfo={invoiceTopInfo}
          delivery={invoiceInfo?.total_delivery}
          paymentInfo={getInvoicePaymentOption()}
          customerInfo={customerInfo || {}}
          invoiceAddress={
            String(invoiceInfo?.invoice_to) || ''
          }
          deliveryAddress={
            String(invoiceInfo?.deliver_to) || ''
          }
          products={[
            ...((invoicedProducts || []).map(val => ({
              ...val,
              total:
                val.unit_price * val.quantity_sold +
                Number(val.vat) -
                Number(val.discount),
            })) || []),
          ]}
          invoiceTotals={{
            ...totals,
            netTotal: totals.netAmount,

            // productTotal,
            // delivery,
            // grossAmount,
            // vatAmount,
            // netTotal: netAmount,
            // amountDue: Number(
            //   invoiceInfo?.transaction.payable || 0,
            // ),
          }}
          downloadAction={() => pdfAction('download')}
          closeAction={closePreviewInvoiceModal}
        />
      </AppModal>
    </>
  )
}

export default InvoiceOptionBtnsWrapper
