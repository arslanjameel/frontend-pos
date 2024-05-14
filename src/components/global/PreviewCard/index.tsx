'use client'
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'

// import { getFullName } from 'src/utils/dataUtils'
// import { useGetCustomerAddressesQuery } from 'src/store/apis/customersSlice'
import {
  COMPANY_ACCOUNT_NAME,
  COMPANY_ACCOUNT_NUMBER,
  COMPANY_NUMBER,
  COMPANY_SORT_CODE,
  COMPANY_VAT_NUMBER,
} from 'src/utils/globalConstants'
import AppTable from '../AppTable'

// import { isCashCustomer } from 'src/utils/customers.util'
// import { ICustomer } from 'src/models/ICustomer'
// import AddressName from '../ValueComponents/AddressName'
import CurrentStoreName from '../CurrentStoreName'
import CurrentStoreAddress from '../CurrentStoreAddress'
import { excludeVAT } from 'src/utils/dataUtils'

interface Props {
  title: string
  invoiceInfo: {
    [key: string]: string
  }
  invoiceTotals?: {
    productTotal: number
    delivery: number
    grossAmount: number
    vatAmount: number
    netTotal: number
    amountDue: number
  }
  products: any[]
  totalsData?: {
    gross: number
    net: number
    vat: number
    sub: number
  }
  delivery?: number
  discount?: number
  amountDue?: number
  paymentInfo?: string
  customerInfo: IData
  invoiceAddress: string
  deliveryAddress: string
  allowPrint?: boolean
  allowEmail?: boolean
  downloadAction?: () => void
  closeAction?: () => void
  notes?: string
  hideAmountDue?: boolean
}

const PreviewCard = ({
  title,
  invoiceInfo,
  invoiceTotals,
  paymentInfo,

  // customerInfo,
  invoiceAddress,
  deliveryAddress,
  products,
  allowPrint,
  allowEmail,
  downloadAction,
  closeAction,
  notes,
  hideAmountDue,
}: Props) => {
  // const { data: addresses } = useGetCustomerAddressesQuery()

  // const getAddress = (id: number) => {
  //   return (addresses ? addresses.results : []).find(
  //     addr => addr.id === id,
  //   )
  // }

  // const customerFullname = getFullName(customerInfo)

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
        <Typography fontSize={13}>
          {params.value}
        </Typography>
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
        <Typography fontSize={13}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'quantity_sold',
      headerName: 'QTY',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 115,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      type: 'number',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
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
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
  ]

  const productsTotalSum = products.reduce(
    (total, curr) => total + curr.total,
    0,
  )

  return (
    <Box>
      {(allowPrint || allowEmail) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 5,
            gap: 2,
          }}
        >
          {allowPrint && (
            <Button
              variant='contained'
              onClick={() => {
                closeAction && closeAction()

                downloadAction && downloadAction()
              }}
            >
              Print
            </Button>
          )}
        </Box>
      )}

      <Box
        id='pdf-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

          border: allowPrint ? '1px solid #ddd' : '',
          py: 8,
          minHeight: 1000,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            px: 8,
          }}
        >
          <Box sx={{ maxWidth: 230 }}>
            <CurrentStoreName />
            <CurrentStoreAddress withMoreInfo />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxWidth: 300,
              flex: 1,
            }}
          >
            <Typography
              variant='h4'
              fontWeight={600}
              textAlign={'right'}
            >
              {title}
            </Typography>

            <Box>
              {Object.entries(invoiceInfo).map(
                (info, i) => (
                  <Box
                    key={info[0]}
                    sx={{ display: 'flex' }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.3,
                        border: '1.5px solid #8f8f8f94',
                        borderBottom:
                          Object.entries(invoiceInfo)
                            .length !==
                          i + 1
                            ? 'none'
                            : '1.5px solid #8f8f8f94',
                        flex: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: 13,
                        background: '#dddddd95',
                      }}
                    >
                      {info[0]}
                    </Box>
                    <Box
                      sx={{
                        p: 1,
                        py: 1.3,
                        border: '1.5px solid #8f8f8f94',
                        borderBottom:
                          Object.entries(invoiceInfo)
                            .length !==
                          i + 1
                            ? 'none'
                            : '1.5px solid #8f8f8f94',
                        borderLeft: 'none',
                        flex: 3,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {info[1]}
                    </Box>
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </Box>

        {/*
        // *
        // * Addresses Section
        // *
        // *
      */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 8,
            my: 6,
          }}
        >
          <Box>
            <Typography variant='h6' fontWeight={600}>
              Invoice Address:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                fontSize: 13,
              }}
            >
              {invoiceAddress.split('\n').map(val => (
                <Typography key={val} fontSize={13}>
                  {val}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 1,
              maxWidth: 280,
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              Delivery Address:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              {deliveryAddress.split('\n').map(val => (
                <Typography key={val} fontSize={13}>
                  {val}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        {/*
        // *
        // * Products Section
        // *
        // *
      */}
        <Box
          sx={{
            mx: 8,
            pb: 8,

            // minHeight: 400,
            // borderBottom: '1.5px solid #ddd',
          }}
        >
          <Box sx={{ border: '1px solid #ddd' }}>
            <AppTable
              compress
              rowHeight={38}
              headerStyle={{ background: '#dddddd95' }}
              columns={columns}
              rows={products}
              miniColumns={['sku']}
              showToolbar={false}
              pagination={false}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}></Box>

        <Box
          sx={{
            display: 'flex',
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
            }}
          >
            <Typography maxWidth={550} fontSize={13}>
              All goods belong to Sharjah Ltd until paid in
              full. Returns accepted up to 30 days form
              invoice date if unused and in the original
              unopened packaging. Special order items cannot
              be returned.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                mt: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    maxWidth: 130,
                    flex: 1,
                  }}
                >
                  Payment terms:
                </Typography>
                <Typography fontWeight={600} fontSize={13}>
                  {' '}
                  30 Days EOM
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                Bank Details
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    maxWidth: 130,
                    flex: 1,
                  }}
                >
                  Account Name:
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {COMPANY_ACCOUNT_NAME}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    maxWidth: 130,
                    flex: 1,
                  }}
                >
                  Sort Code:
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {COMPANY_SORT_CODE}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    maxWidth: 130,
                    flex: 1,
                  }}
                >
                  Account Number:
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {COMPANY_ACCOUNT_NUMBER}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              p: 3,
              flex: 1,
              height: 'fit-content',
              maxWidth: 250,
              display: 'flex',
              gap: 0.8,
              flexDirection: 'column',
              border: '1.5px solid #ddd',
            }}
          >
            {paymentInfo && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ flex: 1, fontSize: 13 }}>
                  Payment Method
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    fontSize: 13,
                  }}
                  fontWeight={600}
                >
                  {paymentInfo}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                Product Total
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {/* excludeVAT(
                  invoiceTotals?.productTotal || 0,
                ), */}
                {formatCurrency(productsTotalSum)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                Delivery
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {formatCurrency(
                  excludeVAT(invoiceTotals?.delivery || 0),
                )}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                Net Amount
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {formatCurrency(
                  invoiceTotals?.netTotal || 0,
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                VAT Amount
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {formatCurrency(
                  invoiceTotals?.vatAmount || 0,
                )}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                Gross Total
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {formatCurrency(
                  invoiceTotals?.grossAmount || 0,
                )}
              </Typography>
            </Box>
            {!hideAmountDue && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ flex: 1, fontSize: 13 }}>
                  Amount Due
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 80,
                    flex: 1,
                    fontSize: 13,
                  }}
                  fontWeight={600}
                >
                  {formatCurrency(invoiceTotals?.amountDue)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1.5px solid #ddd',
            borderBottom: '1.5px solid #ddd',
            py: 3,
            mx: 8,
            gap: 3,
          }}
        >
          <Typography sx={{ maxWidth: 100, fontSize: 13 }}>
            Notes:
          </Typography>
          <Typography sx={{ flex: 1, fontSize: 13 }}>
            {notes}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mx: 8,
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography fontSize={13}>
                Sharjah Ltd Company Number
              </Typography>
              <Typography fontSize={13} fontWeight={600}>
                {COMPANY_NUMBER}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography fontSize={13}>
                VAT Number
              </Typography>
              <Typography fontSize={13} fontWeight={600}>
                {COMPANY_VAT_NUMBER}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* <Typography
              sx={{ maxWidth: 120 }}
              fontWeight={600}
            >
              Salesperson
            </Typography>
            <Typography>
              {salesPerson || 'Alffie Solomons'}
            </Typography> */}
          </Box>
        </Box>
      </Box>
      {/* </PrintComponent> */}
    </Box>
  )
}

export default PreviewCard
