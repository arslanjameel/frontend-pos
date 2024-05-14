import { Box, Card, Grid, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  excludeVAT,
  getFullName,
} from 'src/utils/dataUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import { ICustomer } from 'src/models/ICustomer'
import AddressSection from 'src/components/global/AddressSection'
import { isCashCustomer } from 'src/utils/customers.util'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import OrderActionBtns from 'src/components/orders/OrderActionBtns'
import { calculateInvoiceTotals } from 'src/utils/invoicesUtils'

// import useCalculateTransactionTotals from 'src/hooks/global/useCalculateTransactionTotals'
// import { getPaidFromAmountsTotal } from 'src/utils/transactionUtils'

interface Props {
  customerInfo: ICustomer | IData
  orderInfo?: IData
  invoiceInfo?: ISaleInvoice
  invoicedProducts: any[]
  addresses?: {
    invoiceAddress: string
    deliveryAddress: string
  }
}

const OrderDetailsTab = ({
  customerInfo,
  orderInfo,
  invoiceInfo,
  invoicedProducts,
}: Props) => {
  const isThisACashCustomer = () =>
    customerInfo && isCashCustomer(customerInfo)

  const {
    productTotalExVAT,
    deliveryExVAT,
    netAmountExVAT,
    vatAmountExVAT,
    grossAmountExVAT,
  } = calculateInvoiceTotals(invoicedProducts || [], {
    delivery: Number(orderInfo?.total_delivery) || 0,
    paymentMade: 0,
    quantityKey: 'quantity_hold',
    unitPriceKey: 'unit_price',
  })

  const invoiceTo = orderInfo?.invoice_to
  const deliverTo = orderInfo?.deliver_to

  const { isMobileSize } = useWindowSize()
  const rawDate = orderInfo?.created_at || '' // Ensure you have a valid date string

  const formattedDate = new Date(
    rawDate,
  ).toLocaleDateString('en-US')
  const formattedTime = new Date(
    rawDate,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const customerDetails = {
    'Customer Name': getFullName(customerInfo),
    'Customer ID': customerInfo.id,
    'Customer Ref.': orderInfo?.order_reference || 'N/A',
    'Invoice No.':
      orderInfo?.sale_invoice?.invoice_number || 'N/A',
    'Date Issued': formattedDate,
    Time: formattedTime,
  }
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
      field: 'quantity_hold',
      headerName: 'QTY',
      type: 'number',
      width: 100,
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
          {formatCurrency(excludeVAT(params.value))}
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
        Number(params.row.unit_price) *
          Number(params.row.quantity_hold) -
        excludeVAT(Number(params.row.discount)),
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  const columns2: GridColDef[] = [
    {
      field: 'product_name',
      headerName: 'PRODUCT',
      type: 'string',
      minWidth: 150,
      flex: 1,
      maxWidth: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight={500}>
            {params.value}
          </Typography>
          <Typography variant='body2' sx={{ opacity: 0.7 }}>
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'product_note',
      headerName: 'INTERNAL NOTES',
      type: 'string',
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value || '--'}</Typography>
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
                  Order Details
                </Typography>
                <Typography variant='h5' fontWeight={600}>
                  {orderInfo?.order_number}
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
                      ) : info[0] === 'Invoice No.' ? (
                        <Typography
                          color={
                            Boolean(orderInfo?.sale_invoice)
                              ? 'primary'
                              : 'inherit'
                          }
                          fontWeight={600}
                        >
                          {Boolean(
                            orderInfo?.sale_invoice,
                          ) ? (
                            <Link
                              href={`/invoices/${
                                orderInfo
                                  ? orderInfo?.sale_invoice
                                      .id
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
              value={deliverTo}
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
            <OrderActionBtns
              orderInfo={orderInfo}
              invoiceInfo={invoiceInfo}
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
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              mx: isMobileSize ? 0 : 8,
            }}
          >
            <AppTable
              columns={columns}
              rows={invoicedProducts}
              miniColumns={['sku']}
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
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                minRows={5}
                placeholder='Notes'
                value={orderInfo?.extra_notes || ''}
                sx={{ maxWidth: 380 }}
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
              {/* <Box
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
                  Card
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
                  {formatCurrency(grossAmountExVAT)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        <Card sx={{ mt: 5 }}>
          <AppTable
            columns={columns2}
            rows={orderInfo?.sale_order_track || []}
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar={false}
            showPageSizes={false}
            pagination={false}
            flexHeight
          />
        </Card>
      </Box>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.product_name,
                'SKU:': tableData.sku,
                'Quantity:': tableData.quantity,
                'Unit Price:': tableData.unit_price,
                'Total:': tableData.total,
              }
            : {}
        }
      />
    </>
  )
}

export default OrderDetailsTab
