import React from 'react'
import AppBtn from '../global/AppBtn'
import { Card } from '@mui/material'
import { useRouter } from 'next/router'
import {
  getInvoicePaidAmount,
  getInvoicePaidAndBalance,
} from 'src/utils/invoicesUtils'
import { buildUrl } from 'src/utils/routeUtils'
import PreviewCard from '../global/PreviewCard'
import AppModal from '../global/AppModal'
import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'
import toast from 'react-hot-toast'
import { getFullName } from 'src/utils/dataUtils'
import { dateToString } from 'src/utils/dateUtils'
import EmailCustomerModal from '../customers/EmailCustomerModal'
import { EMAIL_ORDER_BODY } from 'src/utils/globalConstants'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { downloadPDF, emailPDF } from 'src/utils/pdfUtils'
import useGetOrderPDFInfo from 'src/hooks/useGetOrderPDFInfo'
import { useAppSelector } from 'src/store/hooks'
import { useDeleteOrderMutation } from 'src/store/apis/orderSlice'
import ConfirmationModal from '../global/ConfirmationModal'
import ManagerApprovalModal from '../global/Modals/ManagerApprovalModal'
import { isUserAManager } from 'src/utils/rolesUtils'
import { useAuth } from 'src/hooks/useAuth'
import Can from 'src/layouts/components/acl/Can'

interface Props {
  orderInfo?: any
  invoiceInfo?: any
  fullHeight?: boolean
}

const OrderActionBtns = ({
  orderInfo,
  fullHeight = true,
}: Props) => {
  const invoiceExists = Boolean(orderInfo?.sale_invoice)

  const { user } = useAuth()
  const router = useRouter()
  const { store } = useAppSelector(state => state.app)

  const [deleteOrder] = useDeleteOrderMutation()
  const {
    // modalData: orderToEmail,
    openModal: openEmailOrderModal,
    closeModal: closeEmailOrderModal,
    isModalOpen: emailOrderModalStatus,
  } = useModal<IData>()

  const {
    // openModal: openPreviewQuoteModal,
    closeModal: closePreviewQuoteModal,
    isModalOpen: previewQuoteModalStatus,
  } = useModal<any>()

  const {
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<any>()

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const { invoiceDoc } = useGetOrderPDFInfo({
    customerInfo: orderInfo?.customer,
    invoiceInfo: invoiceExists
      ? orderInfo?.sale_invoice
      : undefined,
    orderInfo,
    invoicedProducts: orderInfo
      ? orderInfo?.sale_order_track
      : [],
  })

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = orderInfo ? orderInfo?.customer?.email : '',
  ) => {
    const orderTitle =
      'Order ' + (orderInfo ? orderInfo?.order_number : '')
    if (orderInfo ? orderInfo?.customer : false) {
      const emailInfo = {
        email: emailTo || '',
        email_title: orderTitle,
        email_body: EMAIL_ORDER_BODY,
        store_id: store.id,
      }

      if (action === 'email') {
        emailPDF(
          {
            ...invoiceDoc,
            storeName: store?.name,
            notes: orderInfo?.extra_notes || '',
            isOrder: true,
          },
          emailInfo,
          orderTitle,
        )
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
        downloadPDF(
          {
            ...invoiceDoc,
            storeName: store?.name,
            notes: orderInfo?.extra_notes || '',
            isOrder: true,
          },
          orderTitle,
        )
      }
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailOrderModal()
    pdfAction('email', values.email)
  }

  const downloadOrderPDF = () => pdfAction('download')

  const orderToInvoice = () => {
    const data = {
      customer: orderInfo?.customer,
      invoice_to: orderInfo?.invoice_to || '',
      deliver_to: orderInfo?.deliver_to || '',
      extra_notes: orderInfo?.extra_notes,
      delivery: 0, //not in payload
      products:
        orderInfo?.sale_order_track.map((prod: any) => ({
          ...prod,
          price_band: prod.ordered_price_band,
          quantity: prod.quantity_hold,
          position: prod.invoice_position,
          base_price: prod.unit_price,
        })) || [],
      from: 'order',
      orderId: orderInfo.id,
    }

    localStorage.setItem(
      'itemToInvoice',
      JSON.stringify(data),
    )
    router.push('/invoices/new')
  }

  const addInvoicePayment = () => {
    if (invoiceExists) {
      const data = {
        customer: orderInfo?.sale_invoice.customer,
        products:
          orderInfo?.sale_invoice.sold_on_invoice || [],
        paidAmount:
          getInvoicePaidAmount(orderInfo?.sale_invoice) ||
          0,
        amountDue:
          orderInfo?.sale_invoice?.transaction.payable || 0,
        invoice_number:
          orderInfo?.sale_invoice?.invoice_number,
      }

      if (window) {
        window.localStorage.setItem(
          'addInvoicePayment',
          JSON.stringify(data),
        )
        router.push(buildUrl('receipts', { mode: 'new' }))
      }
    } else {
      toast.error('Generate an invoice for the order first')
    }
  }

  const addReturnAction = () => {
    const data = {
      invoiceId: orderInfo?.sale_invoice?.id,
      invoice: orderInfo?.sale_invoice,
    }

    if (window) {
      window.localStorage.setItem(
        'addReturn',
        JSON.stringify(data),
      )
      router.push(buildUrl('credit-notes', { mode: 'new' }))
    }
  }

  const _deleteOrder = () => {
    if (orderInfo) {
      if (invoiceExists) {
        toast.error(
          'Order cannot be deleted because a Sale Invoice already exists.',
        )

        return
      }

      deleteOrder(orderInfo.id)
        .then((res: any) => {
          if (res.hasOwnProperty('data')) {
            const data1 = res.data

            if (data1.hasOwnProperty('data')) {
              if (hasErrorKey(data1.data as any)) {
                toast.error(
                  extractErrorMessage(data1.data as any),
                )
              }
            } else {
              toast.success('Order deleted successfully')

              router.replace('/orders')
            }
          } else {
            toast.error(
              extractErrorMessage(res?.error as any),
            )
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(e => {
          //204
          toast.success('Order canceled successfully')
          router.replace('/orders')
        })
    }
  }

  const checkIfApprovalNeeded = () => {
    if (!isUserAManager(user)) {
      openManagerApprovalModal()
    } else {
      _deleteOrder()
    }
  }

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: fullHeight ? '100%' : 'fit-content',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <AppBtn
          icon='tabler:mail'
          text='Email Order'
          onClick={() =>
            openEmailOrderModal(orderInfo?.customer || {})
          }
        />
        <AppBtn
          icon='tabler:file-download'
          text='Download'
          onClick={downloadOrderPDF}
        />
        {!orderInfo?.sale_invoice && (
          <Can I='update' an='order'>
            <AppBtn
              icon='tabler:edit'
              text='Edit Order'
              onClick={() =>
                router.push(`/orders/${orderInfo?.id}/edit`)
              }
            />
          </Can>
        )}

        {invoiceExists && (
          <Can I='create' a='receipt'>
            <AppBtn
              icon='tabler:cash'
              text='Add Payment'
              color={
                getInvoicePaidAndBalance(
                  orderInfo?.sale_invoice,
                ).hasBalance
                  ? 'primary'
                  : 'secondary'
              }
              disabled={
                !getInvoicePaidAndBalance(
                  orderInfo?.sale_invoice,
                ).hasBalance
              }
              onClick={addInvoicePayment}
            />
          </Can>
        )}

        {!invoiceExists && (
          <Can I='create' an='invoice'>
            <AppBtn
              icon='tabler:file-dollar'
              text='Generate Invoice'
              onClick={orderToInvoice}
            />
          </Can>
        )}
        {invoiceExists && (
          <Can I='create' a='credit-note'>
            <AppBtn
              icon='tabler:receipt-refund'
              text='Return'
              onClick={addReturnAction}
            />
          </Can>
        )}

        <Can I='delete' an='order'>
          <AppBtn
            icon='tabler:trash'
            text='Delete Order'
            onClick={() => openDeleteModal('')}
          />
        </Can>
      </Card>

      <EmailCustomerModal
        data={{
          email: orderInfo
            ? orderInfo?.customer?.email
            : '',
          customerName: getFullName(
            orderInfo ? orderInfo?.customer : '',
          ),
          documentDate: dateToString(
            new Date(
              orderInfo ? orderInfo?.created_at : '',
            ),
          ),
          documentId: orderInfo
            ? orderInfo?.order_number
            : '',
          documentType: 'Order',
        }}
        onSubmit={confirmSendEmail}
        open={emailOrderModalStatus()}
        handleClose={closeEmailOrderModal}
      />

      <AppModal
        maxWidth={900}
        open={previewQuoteModalStatus()}
        handleClose={closePreviewQuoteModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          title='Order'
          invoiceInfo={{
            'Order Date': dateToString(
              new Date(),
              'dd/MM/yyyy',
            ),
            'Order Time': dateToString(new Date(), 'HH:mm'),
            'Customer No.': orderInfo?.customer?.id,
            'Customer Ref':
              orderInfo?.order_reference || '',
            'Raised By': getFullName(orderInfo?.user),
          }}
          delivery={orderInfo?.total_delivery}
          discount={orderInfo?.total_discount}
          customerInfo={orderInfo?.customer || []}
          invoiceAddress={orderInfo?.deliver_to}
          deliveryAddress={orderInfo?.invoice_to}
          products={orderInfo?.sale_order_track}
        />
      </AppModal>

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Order'
        content={
          'Are you sure you want to delete this order?'
        }
        confirmTitle='Yes'
        onConfirm={checkIfApprovalNeeded}
        rejectTitle='No'
        onReject={closeDeleteModal}
      />

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={_deleteOrder}
      />
    </>
  )
}

export default OrderActionBtns
