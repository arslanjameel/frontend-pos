import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React from 'react'

import { EMAIL_RECEIPT_BODY } from 'src/utils/globalConstants'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import AppBtn from 'src/components/global/AppBtn'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { useAppSelector } from 'src/store/hooks'
import { getFullName } from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import {
  downloadPDFAction,
  emailPDFAction,
} from 'src/utils/pdfUtils'
import { generateReceiptPDF } from 'src/utils/pdfs/generateReceiptPDF'
import { IData } from 'src/utils/types'
import toast from 'react-hot-toast'
import PaidAmountSection from 'src/components/receipts/PaidAmountSection'
import capitalize from 'src/utils/capitalize'
import useGetCityName from 'src/hooks/useGetCityName'
import Can from 'src/layouts/components/acl/Can'

interface Props {
  customerInfo: IData
  receiptInfo?: IData
  invoices: IData[]

  openEmailInvoiceModal: () => void
  openGotoInvoiceModal: () => void
}

const init = {
  paid_from_cash: '0',
  paid_from_card: '0',
  paid_from_bacs: '0',
  paid_from_credit: '0',
}

const ReceiptInfoTab = ({
  customerInfo,
  receiptInfo,
  invoices,
  openGotoInvoiceModal,
}: Props) => {
  const { getCity } = useGetCityName()
  const { store } = useAppSelector(state => state.app)
  const { isMobileSize } = useWindowSize()
  const customerDetails = {
    'Customer Name': `${customerInfo.firstName} ${customerInfo.lastName}`,
    'Customer ID': customerInfo.id,
    'Customer Ref': receiptInfo?.customer_ref || 'N/A',
    'Receipt No.': receiptInfo?.receipt_number || 'N/A',
    'Date Issued': formatDate(receiptInfo?.created_at),
  }

  const receiptType = (invoice: any) => {
    const types = []
    if (Number(invoice.paid_from_bacs) !== 0) {
      types.push('BACS')
    }
    if (Number(invoice.paid_from_card) !== 0) {
      types.push('Card')
    }
    if (Number(invoice.paid_from_cash) !== 0) {
      types.push('Cash')
    }
    if (Number(invoice.paid_from_credit) !== 0) {
      types.push('Credit')
    }
    const type = types.toString()

    return type.replace(',', ' , ')
  }

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    openModal: openEmailCustomerModal,
    closeModal: closeEmailCustomerModal,
    isModalOpen: emailCustomerModalStatus,
  } = useModal<any>()

  const paymentMethods = getPaymentMethods(
    receiptInfo,
  ).reduce((acc, opt) => {
    // @ts-ignore
    acc[opt.title] = formatCurrency(opt.amount)

    return acc
  }, {})

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = customerInfo?.email,
  ) => {
    const receiptTitle =
      'Receipt ' + receiptInfo?.receipt_number

    const emailInfo = {
      email: emailTo || '',
      email_title: receiptTitle,
      email_body: EMAIL_RECEIPT_BODY,
      store_id: store.id,
    }

    const receiptPDF = generateReceiptPDF({
      title: receiptTitle,
      storeName: store?.name,
      storeAddress: [
        capitalize(store.storeAddress),
        getCity(store.city),
        store.postalCode,
        '',
        `Tel No.   ${store.phone}`,
        `Email   ${store.email}`,
      ],
      payments: (invoices || []).map(receipt => ({
        amount_cleared: receipt.amount_cleared,
        invoice_number:
          receipt?.sale_invoice?.invoice_number,
      })),
      receiptTopData: {
        'Receipt Date': dateToString(
          new Date(receiptInfo?.created_at || ''),
          'dd/MM/yyyy',
        ),
        'Receipt Time': dateToString(
          new Date(receiptInfo?.created_at || ''),
          'HH:mm',
        ),
        'Customer No.': customerInfo?.id || '',
        'Customer Ref.': receiptInfo?.customer_ref || '',
        'Raised By': getFullName(receiptInfo?.user) || '',
      },
      totals: {
        'Payment Method': getPaymentMethodsStr(
          getPaymentMethods(receiptInfo),
        ),
        'Net Amount': formatCurrency(
          Number(receiptInfo?.payment) / 1.2,
        ),
        'VAT Amount': formatCurrency(
          Number(receiptInfo?.payment) -
            Number(receiptInfo?.payment) / 1.2,
        ),
        'Gross Amount': formatCurrency(
          receiptInfo?.payment,
        ),
        ' ': '',
        'Paid Amount': formatCurrency(
          Number(receiptInfo?.payment) || 0,
        ),
        ...paymentMethods,
      },
    })

    if (action === 'email') {
      emailPDFAction(receiptPDF, emailInfo, receiptTitle)
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
      downloadPDFAction(receiptPDF, receiptTitle)
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailCustomerModal()
    pdfAction('email', values.email)
  }

  const downloadReceiptPDF = () => pdfAction('download')

  const columns: GridColDef[] = [
    {
      field: 'invoice_number',
      headerName: 'INVOICE NO.',
      type: 'string',
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {params.row.sale_invoice.invoice_number}
        </Typography>
      ),
    },
    {
      field: 'amount_cleared',
      headerName: 'AMOUNT CLEARED',
      type: 'number',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value).toFixed(2))}
        </Typography>
      ),
    },
  ]

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Grid
          container
          columns={12}
          spacing={6}
          sx={{ mb: 6 }}
        >
          <Grid item md={4} sm={6} xs={12}>
            <Card
              style={{
                height: '100%',
              }}
            >
              <Box
                sx={{
                  px: 6,
                  height: 50,
                  borderBottom: '1.3px solid #dcdcdc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h5' fontWeight={600}>
                  Receipt Details
                </Typography>
                <Typography variant='h5' fontWeight={600}>
                  {receiptInfo?.receipt_number}
                </Typography>
              </Box>

              <Box
                sx={{
                  py: 3,
                  px: 6.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {Object.entries(customerDetails).map(
                  info => (
                    <Box
                      key={info[0]}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          minWidth: 130,
                          fontWeight: 600,
                        }}
                      >
                        {info[0]}
                      </Typography>
                      {info[0] === 'Customer Name' ? (
                        <Typography
                          color='primary'
                          fontWeight={600}
                        >
                          <Link
                            href={`/customers/${customerInfo.id}`}
                          >
                            {info[1]}
                          </Link>
                        </Typography>
                      ) : (
                        <Typography>{info[1]}</Typography>
                      )}
                    </Box>
                  ),
                )}
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <Card
              sx={{
                height: '100%',
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
                {receiptInfo?.extra_notes}
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <Card
              sx={{
                width: '100%',
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <AppBtn
                icon='tabler:mail'
                text='Email Receipt'
                onClick={openEmailCustomerModal}
              />
              {/* <AppBtn
                icon='tabler:trash'
                text='Void Receipt'
              /> */}
              <AppBtn
                icon='tabler:file-download'
                text='Download'
                onClick={downloadReceiptPDF}
              />
              <Can I='read' an='invoice'>
                <AppBtn
                  icon='tabler:file-dollar'
                  text='Go to Invoice'
                  onClick={openGotoInvoiceModal}
                />
              </Can>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            border: '1px solid #ddd',
            py: 5,
          }}
        >
          <Typography
            variant='h5'
            sx={{ fontWeight: 600, mx: 8 }}
          >
            Invoices
          </Typography>
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              mx: isMobileSize ? 0 : 8,
            }}
          >
            <AppTable
              columns={columns}
              rows={invoices}
              miniColumns={['invoice_number']}
              openMiniModal={openTableDataModal}
              showToolbar={false}
              pagination={false}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 3,
              px: 8,
            }}
          >
            <PaidAmountSection
              fontSize={15}
              totalPayment={
                Number(receiptInfo?.payment) || 0
              }
              paymentsObj={receiptInfo}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 'fit-content',
                maxWidth: 360,
                ml: 'auto',
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  Payment Method
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 200,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {receiptType(receiptInfo || init)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  Net Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 200,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(
                    (
                      Number(receiptInfo?.payment) / 1.2
                    ).toFixed(2),
                  )}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  VAT Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 200,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(
                    (
                      Number(receiptInfo?.payment) -
                      Number(receiptInfo?.payment) / 1.2
                    ).toFixed(2),
                  )}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    textAlign: 'left',
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  Gross Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 200,
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(
                    Number(receiptInfo?.payment).toFixed(2),
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.invoiceNumber}`
            : ''
        }
        tableData={
          tableData
            ? {
                'InvoiceNo:': tableData.invoiceNumber,
                'Amount:': formatCurrency(tableData.amount),
              }
            : {}
        }
      />

      <EmailCustomerModal
        data={{
          email: customerInfo?.email || '',
          customerName: getFullName(customerInfo) || '',
          documentDate: dateToString(
            new Date(receiptInfo?.created_at || ''),
          ),
          documentId: receiptInfo?.receipt_number || '',
          documentType: 'Receipt',
        }}
        onSubmit={confirmSendEmail}
        open={emailCustomerModalStatus()}
        handleClose={closeEmailCustomerModal}
      />
    </>
  )
}

export default ReceiptInfoTab
