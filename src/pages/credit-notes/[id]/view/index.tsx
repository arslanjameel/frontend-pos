import { Box, Card, Grid, Typography } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

// import DeliveryNotesModal from 'src/components/invoices/DeliveryNotesModal'
import { useModal } from 'src/hooks/useModal'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import { isIdValid } from 'src/utils/routerUtils'
import {
  getFullName,
  includeVAT,
} from 'src/utils/dataUtils'
import CreditNoteInfoTab from './CreditNoteInfoTab'
import { useGetSinglereturnSaleQuery } from 'src/store/apis/SalesSlice'
import { useGetSingleInvoiceQuery } from 'src/store/apis/invoicesSlice'
import { EMAIL_CREDIT_NOTE_BODY } from 'src/utils/globalConstants'
import {
  downloadPDFAction,
  emailPDFAction,
} from 'src/utils/pdfUtils'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { useAppSelector } from 'src/store/hooks'
import { generateCreditNotePDF } from 'src/utils/pdfs/generateCreditNote'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import {
  getInvoicePaidAmount,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { calculateCRTotals } from 'src/utils/creditNotesUtils'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import capitalize from 'src/utils/capitalize'
import useGetCityName from 'src/hooks/useGetCityName'

const ViewCreditNotePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const { getCity } = useGetCityName()

  const { store } = useAppSelector(state => state.app)

  const { data: creditNoteData } =
    useGetSinglereturnSaleQuery(id)

  const { data: invoiceInfo } = useGetSingleInvoiceQuery(
    creditNoteData?.sale_invoices.id,
  )

  // const {
  // modalData: deliveryNotesData,
  // openModal: openDeliveryNotesModal,
  //   closeModal: closeDeliveryNotesModal,
  //   isModalOpen: deliveryNotesModalStatus,
  // } = useModal<IData[]>()

  const {
    openModal: openEmailCRModal,
    closeModal: closeEmailCRModal,
    isModalOpen: emailCRModalStatus,
  } = useModal<IData>()

  // const [openedMiniTab, setOpenedMiniTab] = useState(0)

  // const {
  //   openModal: openPreviewInvoiceModal,
  //   closeModal: closePreviewInvoiceModal,
  //   isModalOpen: previewInvoiceModalStatus,
  // } = useModal<any>()

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = invoiceInfo?.customer?.email,
  ) => {
    const pdfTitle = `Credit Note ${creditNoteData?.return_number}`

    const totals = calculateCRTotals(
      creditNoteData,
      invoiceInfo ? getInvoicePaidAmount(invoiceInfo) : 0,
    )
    const paymentMethods = getPaymentMethods(
      creditNoteData,
    ).reduce((acc, opt) => {
      // @ts-ignore
      acc[opt.title] = formatCurrency(opt.amount)

      return acc
    }, {})

    const creditNoteDoc = generateCreditNotePDF({
      title: pdfTitle,
      products: (creditNoteData?.return_on || []).map(
        (prod: any) => ({
          sku: prod.sku,
          product_name: prod.product_name,
          quantity: prod.quantity_returned,
          unit_price: prod.unit_price,
          vat_inc: includeVAT(prod.unit_price),
          restocking_fee: prod.restocking_fee,
          total:
            Number(prod.return_price) *
            Number(prod.quantity_returned),
        }),
      ),
      topData: {
        'Credit Note Date': dateToString(
          new Date(creditNoteData?.created_at),
          'dd/MM/yyyy',
        ),
        'Customer No.': invoiceInfo?.id || '',
        'Customer Ref.':
          creditNoteData?.customer_reference || '',
        'Invoice No.': invoiceInfo?.invoice_number || '',
        'Raised By': invoiceInfo
          ? getFullName(invoiceInfo.user)
          : '',
      },
      totals: {
        'Refund Method': getPaymentMethodsStr(
          getPaymentMethods(creditNoteData),
        ),
        'Net Amount': formatCurrency(totals.net),
        'VAT Amount': formatCurrency(totals.vat),

        'Subtotal ': formatCurrency(totals.subtotal),
        'Invoice Amount Paid': formatCurrency(
          invoiceInfo
            ? getInvoicePaidAmount(invoiceInfo)
            : 0,
        ),
        'Restocking Fee':
          '-' +
          formatCurrency(
            creditNoteData?.total_restocking_fee,
          ),

        'Gross Amount': formatCurrency(totals.gross),
      },
      storeName: store.name,
      storeAddress: [
        capitalize(store.storeAddress),
        getCity(store.city),
        store.postalCode,
        '',
        `Tel No.   ${store.phone}`,
        `Email   ${store.email}`,
      ],
      refundOptions: {
        'Refund Amount': formatCurrency(
          creditNoteData?.payment_to_customer || 0,
        ),
        ...paymentMethods,
      },
    })

    if (store) {
      if (invoiceInfo?.customer) {
        const emailInfo = {
          email: emailTo || '',
          email_title: pdfTitle,
          email_body: EMAIL_CREDIT_NOTE_BODY,
          store_id: store.id,
        }

        if (action === 'email') {
          emailPDFAction(creditNoteDoc, emailInfo, pdfTitle)
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
          downloadPDFAction(creditNoteDoc, pdfTitle)
        }
      }
    } else {
      toast.error('Select a store')
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailCRModal()
    pdfAction('email', values.email)
  }

  const downloadAction = () => pdfAction('download')

  const goToInvoice = () => {
    router.replace(
      `/invoices/${creditNoteData?.sale_invoices.id}/view/`,
    )
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Credit Note', to: '/credit-notes' },
          { label: 'View', to: '#' },
        ]}
      >
        <Grid
          container
          columns={12}
          rowSpacing={2}
          columnSpacing={9}
        >
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flex: 1,
              }}
            >
              <CreditNoteInfoTab
                invoiceInfo={invoiceInfo}
                customerInfo={
                  creditNoteData?.customer || []
                }
                totalamount={creditNoteData}
                returnInfo={creditNoteData}
                invoicedProducts={
                  creditNoteData?.return_on || []
                }
                openEmailInvoiceModal={openEmailCRModal}
                openPreviewInvoiceModal={downloadAction}
                goToInvoice={goToInvoice}
              />
            </Box>
          </Grid>

          {/*   <Grid
            item
            md={3.4}
            sm={12}
            xs={12}
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card sx={{ flex: 1, px: 3, py: 1 }}>
              <AppTabs
                legacy
                openedTab={openedMiniTab}
                changeTab={tabId => setOpenedMiniTab(tabId)}
                tabs={[
                  {
                    id: 0,
                    icon: 'tabler:trending-up',
                    title: 'Activity',
                    content: (
                      <Box sx={{ py: 4 }}>
                        <ChatCard
                          img='add-img-link'
                          text='Raw Products with SKU FRANKIE TP125 has been deleted'
                          time='Today 10.00 AM'
                        />
                        <Divider sx={{ my: 2 }} />
                        <ChatCard
                          img='add-img-link'
                          text='Raw Products with SKU FRANKIE TP125 has been deleted'
                          time='Today 10.00 AM'
                        />
                      </Box>
                    ),
                  },
                ]}
                topContainerSx={{ width: '100%' }}
                bottomContainerSx={{ height: '100%' }}
                tabSx={{ flex: 1 }}
              />
            </Card> 
          </Grid>*/}

          <Grid item md={12} sm={12} xs={12} sx={{ mt: 4 }}>
            <Card
              sx={{
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1.3px solid #dcdcdc',
                  px: 5,
                  height: 50,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    variant={'h6'}
                    fontWeight={600}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    Internal Notes
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 5, pb: 3 }}>
                {creditNoteData?.extra_notes}
              </Box>
            </Card>
          </Grid>

          <Grid item md={12} sm={12} xs={12} sx={{ mt: 4 }}>
            {/* <CommentsSection /> */}
          </Grid>
        </Grid>
      </PageContainer>

      {/* <DeliveryNotesModal
        open={deliveryNotesModalStatus()}
        handleClose={closeDeliveryNotesModal}
        data={{
          customerDeliveryAddress: '',
          customerName: '--',
          customerRef: '--',
          productsInfo: [],
        }}
        print={() => {
          toast.success('TODO: print')
          closeDeliveryNotesModal()
        }}
        markAsComplete={() => {
          console.log('TODO')
        }}
      /> */}

      <EmailCustomerModal
        data={{
          email: invoiceInfo?.customer.email || '',
          customerName: getFullName(invoiceInfo?.customer),
          documentDate: formatDate(
            creditNoteData?.created_at,
          ),
          documentId: creditNoteData?.return_number,
          documentType: 'Credit Note',
        }}
        onSubmit={confirmSendEmail}
        open={emailCRModalStatus()}
        handleClose={closeEmailCRModal}
      />

      {/* <AppModal
        maxWidth={900}
        open={previewInvoiceModalStatus()}
        handleClose={closePreviewInvoiceModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          allowPrint
          title='Invoice 3485'
          invoiceInfo={{
            'Invoice Date': formattedDate,
            'Invoice Time': formattedTime,
            'Customer No.': creditNoteData?.customer
              ? creditNoteData?.customer.id.toString()
              : '--',
            'Customer Ref': '--',
            'Raised By': creditNoteData?.user
              ? creditNoteData?.user.first_name
              : ' ',
          }}
          paymentInfo={[]}
          customerInfo={creditNoteData?.customer || {}}
          invoiceAddress={
            creditNoteData?.customer?.addresses[0] || 0
          }
          deliveryAddress={
            creditNoteData?.customer?.addresses[1] || 0
          }
          products={creditNoteData?.return_on || []}
          totaldata={creditNoteData || []}
        />
      </AppModal> */}
    </>
  )
}

export default ViewCreditNotePage
