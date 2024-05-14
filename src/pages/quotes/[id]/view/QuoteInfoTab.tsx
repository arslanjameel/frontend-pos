import { Box, Card, Grid, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import AddressSection from 'src/components/global/AddressSection'
import AppBtn from 'src/components/global/AppBtn'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import TableDataModal from 'src/components/global/TableDataModal'
import useGetCityName from 'src/hooks/useGetCityName'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Can from 'src/layouts/components/acl/Can'
import { useDeleteSingleQuoteMutation } from 'src/store/apis/quotesSlice'
import { useAppSelector } from 'src/store/hooks'

// import AppModal from 'src/components/global/AppModal'
// import PreviewCard from 'src/components/global/PreviewCard'
// import {
//   useGetCitiesQuery,
//   useGetCountriesQuery,
// } from 'src/store/apis/accountSlice'
// import {
//   getAddressInfo,
//   getCityName,
//   getCountryName,
// } from 'src/utils/addressUtils'
// import { isCashCustomer } from 'src/utils/customers.util'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import capitalize from 'src/utils/capitalize'
import {
  excludeVAT,
  getFullName,
  numTo2dp,
} from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { EMAIL_QUOTE_BODY } from 'src/utils/globalConstants'
import {
  calculateInvoiceTotals,
  calculateRowExVAT,
} from 'src/utils/invoicesUtils'
import {
  downloadPDFAction,
  emailPDFAction,
} from 'src/utils/pdfUtils'
import { generateQuotePDF } from 'src/utils/pdfs/generateQuotePDF'
import {
  calculateQuotesTotal,

  // addQuotesTotalColumn,
  // calculateQuoteValue,
} from 'src/utils/transactionUtils'
import { IData } from 'src/utils/types'

interface Props {
  customerInfo: IData
  quoteInfo: IData
  quotedProducts: any[]
  addresses?: {
    invoiceAddress: string
    deliveryAddress: string
  }
}

const QuoteInfoTab = ({
  customerInfo,
  quoteInfo,
  quotedProducts,
  addresses,
}: Props) => {
  const router = useRouter()
  const { store } = useAppSelector(state => state.app)

  const {
    openModal: openEmailCustomerModal,
    closeModal: closeEmailCustomerModal,
    isModalOpen: emailCustomerModalStatus,
  } = useModal<any>()

  const {
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const [deleteQuote] = useDeleteSingleQuoteMutation()

  const { getCity } = useGetCityName()

  const { isMobileSize } = useWindowSize()
  const customerDetails = {
    'Customer Name': getFullName(customerInfo) || 'N/A',
    'Customer ID': quoteInfo?.customer
      ? quoteInfo?.customer.id
      : 'N/A',
    'Customer Ref': quoteInfo?.customer_reference || 'N/A',
    'Quote No.': quoteInfo?.quote_number || 'N/A',
    'Date Issued': formatDate(quoteInfo?.created_at),
    'Expiry Date': formatDate(quoteInfo?.quote_expire_date),
  }

  const quoteTotals = calculateInvoiceTotals(
    quotedProducts || [],
    {
      delivery: 0,
      paymentMade: 0,
      unitPriceKey: 'unit_price',
      quantityKey: 'quantity',
    },
  )

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(excludeVAT(Number(params.value)))}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      valueGetter: params =>
        calculateRowExVAT(params.row, {
          quantityKey: 'quantity',
        }),

      // valueGetter: params =>
      //   calculateProductTableTotal({ rowData: params.row }),
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = customerInfo?.email,
  ) => {
    if (customerInfo) {
      const quoteTitle = 'Quote ' + quoteInfo?.quote_number

      const emailInfo = {
        email: emailTo || '',
        email_title: quoteTitle,
        email_body: EMAIL_QUOTE_BODY,
        store_id: store?.id,
      }

      const quotationAddress = quoteInfo
        ? quoteInfo?.invoice_to.split('\n')
        : []

      const generatedQuotePDF = generateQuotePDF({
        title: quoteTitle,
        quotationAddress,
        products: quotedProducts.map(prod => ({
          ...prod,
          discount: excludeVAT(prod.discount),
          total: Number(
            excludeVAT(Number(calculateQuotesTotal(prod))),
          ),
        })),
        quoteTopData: {
          'Quotation Date': dateToString(
            new Date(quoteInfo.created_at),
            'dd/MM/yyyy',
          ),

          'Customer Ref':
            quoteInfo?.customer_reference || '--',

          'Customer No.': quoteInfo.customer.id,

          'Expiry Date': dateToString(
            new Date(quoteInfo.quote_expire_date),
            'dd/MM/yyyy',
          ),
          'Raised By': getFullName(quoteInfo.user),
        },
        totals: {
          'Net Amount': formatCurrency(
            quoteTotals?.netAmountExVAT,
          ),
          'VAT Amount': formatCurrency(
            quoteTotals.vatAmountExVAT,
          ),
          'Gross Total': formatCurrency(
            quoteTotals.grossAmountExVAT,
          ),
        },
        notes: quoteInfo?.extra_notes || '',
        storeName: store?.name,
        storeAddress: [
          capitalize(store.storeAddress),
          getCity(store.city),
          store.postalCode,
          '',
          `Tel No.   ${store.phone}`,
          `Email   ${store.email}`,
        ],
      })

      if (action === 'email') {
        emailPDFAction(generatedQuotePDF, emailInfo)
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
          .finally(() => closeEmailCustomerModal())
      } else {
        downloadPDFAction(generatedQuotePDF, quoteTitle)
      }
    }
  }

  const downloadQuote = () => {
    pdfAction('download')
  }
  const emailQuote = (params: { email: string }) => {
    pdfAction('email', params.email)
  }

  const voidQuote = () => {
    deleteQuote(quoteInfo?.id)
      .unwrap()
      .then(() => {
        router.replace('/quotes')
        toast.success('Quote deleted successfully')
      })
      .catch(() => toast.error('An error occurred'))
  }

  const quoteToOrder = () => {
    const products = quoteInfo?.sale_quote.map(
      (prod: any) => {
        return {
          ...prod,
          id: prod.product,
          base_price: prod.unit_price,
          position: prod.quote_position,
          price_band: prod.quote_price_band,
          discount: Number(prod.discount),
          total: Number(calculateQuotesTotal(prod)),
          unit_price: Number(prod.unit_price),
          ordered: false,
          status: 'pick_up',
        }
      },
    )
    const data = {
      customer: customerInfo,
      invoice_to: addresses?.deliveryAddress,
      deliver_to: addresses?.deliveryAddress,
      extra_notes: quoteInfo?.extra_notes,
      products: products,
      customer_reference: quoteInfo?.customer_reference, //referenceValue
      delivery: Number(quoteInfo?.delivery),
    }

    localStorage.setItem(
      'quoteToOrder',
      JSON.stringify(data),
    )
    router.push('/orders/new')
  }

  const quoteToInvoice = () => {
    const products = quoteInfo?.sale_quote.map(
      (prod: any) => {
        return {
          ...prod,
          id: prod.product,
          base_price: prod.unit_price,
          position: prod.quote_position,
          price_band: prod.quote_price_band,
          discount: Number(prod.discount),
          total: Number(calculateQuotesTotal(prod)),
          unit_price: Number(prod.unit_price),
          ordered: false,
          status: 'pick_up',
        }
      },
    )
    const data = {
      customer: customerInfo,
      invoice_to: addresses?.deliveryAddress,
      deliver_to: addresses?.deliveryAddress,
      extra_notes: quoteInfo?.extra_notes,
      products: products,
      customer_reference: quoteInfo?.customer_reference, //referenceValue
      delivery: Number(quoteInfo?.delivery),
    }

    localStorage.setItem(
      'quoteToInvoiceFromView',
      JSON.stringify(data),
    )
    router.push('/invoices/new')
  }

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Grid
          container
          columns={12}
          spacing={6}
          sx={{ mb: 6 }}
        >
          <Grid item md={3.5} sm={6} xs={12}>
            <Card>
              <Box
                sx={{
                  px: 6.5,
                  height: 50,
                  borderBottom: '1.3px solid #dcdcdc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h5' fontWeight={600}>
                  Quote Details
                </Typography>
                <Typography variant='h5' fontWeight={600}>
                  {quoteInfo?.quote_number}
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
                            href={`/customers/${customerInfo?.id}`}
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
            md={2.75}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <AddressSection
              title='Invoices To'
              value={quoteInfo?.invoice_to}
            />
          </Grid>

          <Grid
            item
            md={2.75}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <AddressSection
              title='Deliver To'
              value={quoteInfo?.deliver_to}
            />
          </Grid>
          <Grid
            item
            md={3}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <Card sx={{ p: 3, flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <AppBtn
                  icon='tabler:mail'
                  text='Email Quotation'
                  onClick={openEmailCustomerModal}
                />
                <AppBtn
                  icon='tabler:file-download'
                  text='Download'
                  onClick={downloadQuote}
                />

                <Can I='delete' a='quote'>
                  <AppBtn
                    icon='tabler:trash'
                    text='Void Quotation'
                    onClick={() => openDeleteModal(1)}
                  />
                </Can>

                {(store as any)?.storeType == 'B2B' ? (
                  <AppBtn
                    icon='tabler:send'
                    text='Convert to Order'
                    onClick={() => quoteToOrder()}
                  />
                ) : (
                  <AppBtn
                    icon='tabler:send'
                    text='Convert to Invoice'
                    onClick={() => quoteToInvoice()}
                  />
                )}
              </Box>
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
            Products
          </Typography>
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              mx: isMobileSize ? 0 : 8,
            }}
          >
            <AppTable
              columns={columns}
              rows={quotedProducts || []}
              miniColumns={['product_name']}
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
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
                pt: isMobileSize ? 6 : 10,
                pb: isMobileSize ? 6 : 0,
                minWidth: 200,
              }}
            >
              <CustomTextField
                fullWidth
                multiline
                minRows={5}
                placeholder='Notes'
                sx={{ maxWidth: 380 }}
                value={
                  quoteInfo ? quoteInfo.extra_notes : ''
                }
                disabled
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 140,
                maxWidth: 220,
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
                  Product Total
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                    borderBottom: '1px solid #a6a6a67c',
                  }}
                >
                  {formatCurrency(
                    quoteTotals?.productTotalExVAT,
                  )}
                  {/* {formatCurrency(
                    calculateQuoteValue(
                      quoteInfo?.sale_quote || [],
                      quoteInfo?.delivery || 0,
                      'total',
                    ),
                  )} */}
                </Typography>
              </Box>
              {/* 
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
                  Delivery
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                    borderBottom: '1px solid #a6a6a67c',
                  }}
                >
                  {formatCurrency(quoteTotals?.delivery)}
                </Typography>
              </Box> */}

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
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(
                    quoteTotals?.netAmountExVAT,
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
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                    borderBottom: '1px solid #a6a6a67c',
                  }}
                >
                  {/* {formatCurrency(
                    Number(
                      quoteInfo?.total_vat || 0,
                    ).toFixed(2),
                  )} */}
                  {formatCurrency(
                    quoteTotals?.vatAmountExVAT,
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
                  sx={{
                    fontSize: 17,
                    textAlign: 'left',
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  Gross Total
                </Typography>
                <Typography
                  sx={{
                    fontSize: 17,
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(
                    numTo2dp(
                      Number(
                        quoteTotals.grossAmountExVAT || 0,
                      ),
                    ),
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* <AppModal
        maxWidth={900}
        open={previewQuoteModalStatus()}
        handleClose={closePreviewQuoteModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          allowPrint
          title='Quote'
          invoiceInfo={{
            'Quotation Date': dateToString(
              new Date(),
              'dd/MM/yyyy',
            ),
            'Quotation Time': dateToString(
              new Date(),
              'HH:mm',
            ),
            'Customer No.': customerInfo.id,
            'Customer Ref': quoteInfo?.customer_reference,
            'Raised By': '',
            'Page Number': '',
          }}
          delivery={quoteInfo?.delivery}
          discount={quoteInfo?.total_discount}
          paymentInfo={''}
          customerInfo={customerInfo}
          invoiceAddress={0}
          deliveryAddress={0}
          products={quoteInfo?.sale_quote}
        />
      </AppModal> */}

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.name,
                'SKU:': tableData.sku,
                'Quantity:': tableData.quantity,
                'Unit Price:': tableData.unitPrice,
                'Total:': tableData.total,
              }
            : {}
        }
      />

      <EmailCustomerModal
        data={{
          email: customerInfo?.email || '',
          customerName: getFullName(customerInfo) || '',
          documentDate: dateToString(
            new Date(quoteInfo?.created_at || ''),
          ),
          documentId: quoteInfo?.invoice_number || '',
          documentType: 'Quote',
        }}
        onSubmit={emailQuote}
        open={emailCustomerModalStatus()}
        handleClose={closeEmailCustomerModal}
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Quote'
        content={
          'Are you sure you want to delete this quote?'
        }
        confirmTitle='Delete'
        onConfirm={voidQuote}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

export default QuoteInfoTab
