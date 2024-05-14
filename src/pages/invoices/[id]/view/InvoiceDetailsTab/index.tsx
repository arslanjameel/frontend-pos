import { Box, Card, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import FallbackSpinner from 'src/@core/components/spinner'
import VoidInvoiceModal from 'src/components/invoices/VoidInvoiceModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { ICustomer } from 'src/models/ICustomer'
import {
  ISaleInvoice,
  ProductSoldOn,
} from 'src/models/ISaleInvoice'
import { getFullName } from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import BottomProductsTable from '../BottomProductsTable'
import BottomTabsList from './BottomTabsList'
import { useGetInvoiceReceiptsQuery } from 'src/store/apis/receiptsSlice'
import {
  calculateInvoiceTotals,
  getInvoicePaidAndBalance,
  getPaymentMethods,
} from 'src/utils/invoicesUtils'
import MainTable from './MainTable'
import { isCashCustomer } from 'src/utils/customers.util'
import AddressSection from 'src/components/global/AddressSection'
import InvoiceOptionBtnsWrapper from 'src/components/invoices/InvoiceOptionBtnsWrapper'

interface Props {
  invoiceId: number
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  invoicedProducts?: ProductSoldOn[]
}

const InvoiceDetailsTab = ({
  invoiceId,
  customerInfo,
  invoiceInfo,
  invoicedProducts,
}: Props) => {
  const isThisACashCustomer = () =>
    customerInfo && isCashCustomer(customerInfo)

  const { data: invoiceReceipts } =
    useGetInvoiceReceiptsQuery(invoiceId)

  // const getAddress = (id: number) => {
  //   return (addresses ? addresses.results : []).find(
  //     addr => addr.id === id,
  //   )
  // }

  const { isMobileSize } = useWindowSize()

  const {
    // openModal: openVoidInvoiceModal,
    closeModal: closeVoidInvoiceModal,
    isModalOpen: voidInvoiceModalStatus,
  } = useModal<any>()

  if (!customerInfo && !invoiceInfo)
    return (
      <FallbackSpinner
        brief
        sx={{
          height: 100,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )

  const customerDetails = {
    'Customer Name': getFullName(customerInfo),
    'Customer ID': customerInfo?.id,
    'Customer Ref': invoiceInfo?.invoice_reference || '--',
    'Invoice No.': invoiceInfo?.invoice_number || '--',
    'Order No.': invoiceInfo?.sale_order || '--',
    'Date Issued': dateToString(
      new Date(customerInfo?.createdAt || ''),
      'dd/MM/yyyy',
    ),
    Time: dateToString(
      new Date(customerInfo?.createdAt || ''),
      'HH:mm',
    ),
  }

  const invoiceTo = invoiceInfo?.invoice_to
  const deliverTo = invoiceInfo?.deliver_to

  const {
    productTotalExVAT,
    deliveryExVAT,
    netAmountExVAT,
    vatAmountExVAT,
    grossAmountExVAT,
    amountDue,
  } = calculateInvoiceTotals(invoicedProducts || [], {
    delivery: Number(invoiceInfo?.total_delivery) || 0,
    paymentMade: invoiceInfo
      ? getInvoicePaidAndBalance(invoiceInfo).amountPaid
      : 0,
  })

  const _voidInvoice = (copyToNewInvoice: boolean) => {
    toast.success('TODO: Void this invoice')

    if (copyToNewInvoice) {
      toast.success('TODO: Copy contents to new invoice')
    }
    closeVoidInvoiceModal()
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
            <Card sx={{ height: '100%' }}>
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
                  Invoice Details
                </Typography>
                <Typography variant='h5' fontWeight={600}>
                  {invoiceInfo?.invoice_number || '--'}
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
                            href={`/customers/${
                              customerInfo
                                ? customerInfo.id
                                : '-1'
                            }`}
                          >
                            {info[1]}
                          </Link>
                        </Typography>
                      ) : info[0] === 'Order No.' ? (
                        <Typography
                          color='primary'
                          fontWeight={600}
                        >
                          {invoiceInfo?.sale_order ? (
                            <Link
                              href={`/orders/${
                                invoiceInfo
                                  ? invoiceInfo.sale_order
                                  : '-1'
                              }/view`}
                            >
                              {info[1]}
                            </Link>
                          ) : (
                            info[1]
                          )}
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
              value={String(invoiceTo) || ''}
              isCashCustomer={isThisACashCustomer()}
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
              value={String(deliverTo) || ''}
              isCashCustomer={isThisACashCustomer()}
            />
          </Grid>

          <Grid
            item
            md={3}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <InvoiceOptionBtnsWrapper
              invoiceInfo={invoiceInfo}
              customerInfo={customerInfo}
              invoicedProducts={invoicedProducts || []}
            />
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

          <MainTable products={invoicedProducts || []} />

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
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                minRows={5}
                placeholder='Notes'
                sx={{ maxWidth: 380 }}
                value={
                  invoiceInfo ? invoiceInfo.extra_notes : ''
                }
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
                  Payment Method
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {invoiceInfo
                    ? getPaymentMethods(
                        invoiceInfo.transaction,
                      )
                        .map(p => p.title)
                        .join(', ') || 'To Pay'
                    : 'To Pay'}
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
                  Product Total
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(productTotalExVAT)}
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
                  {formatCurrency(deliveryExVAT)}
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
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(netAmountExVAT)}
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
                  {formatCurrency(vatAmountExVAT)}
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
                  Gross Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(grossAmountExVAT)}
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
                  Amount Due
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
                  {formatCurrency(amountDue)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        <Box height={20}></Box>

        <Grid
          container
          columns={12}
          rowSpacing={6}
          columnSpacing={6}
        >
          <Grid item md={8} sm={6} xs={12}>
            <Card sx={{ height: '100%' }}>
              <BottomProductsTable
                invoicedProducts={invoicedProducts || []}
              />
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card sx={{ flex: 1, px: 3, py: 1 }}>
              <BottomTabsList
                itemsList={
                  invoiceReceipts
                    ? invoiceReceipts.results.map(val => ({
                        link: `/receipts/${val.id}/view/`,
                        label: val.receipt_number,
                        value: formatDate(val.created_at),
                      }))
                    : []
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      <VoidInvoiceModal
        open={voidInvoiceModalStatus()}
        onClose={closeVoidInvoiceModal}
        onConfirm={_voidInvoice}
      />
    </>
  )
}

export default InvoiceDetailsTab
