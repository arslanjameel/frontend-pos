'use client'
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import AppTable from 'src/components/global/AppTable'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import { getFullName } from 'src/utils/dataUtils'
import { IPayInfo } from 'src/types/IPayInfo'

// import useGeneratePDF from 'src/hooks/useGeneratePDF'

interface Props {
  title: string
  invoiceInfo: {
    [key: string]: string
  }

  products: any[]
  totalsData?: {
    gross: number
    net: number
    vat: number
    sub: number
  }
  discount?: number
  amountDue?: number
  paymentInfo?: IPayInfo[]
  customerInfo: IData
  invoiceAddress: {
    addressNickName: any
    addressLine1: any
  }
  deliveryAddress: {
    addressNickName: any
    addressLine1: any
  }
  allowPrint?: boolean
  totaldata?: {
    sale_invoices?: {
      invoice_number: any
      total_vat: any
      total_restocking_fee: any
    }
    created_at: any
    extra_notes: any
    total: any
    invoice_number: any
    return_number: any
    return_on: any[]
    total_vat?: any
    total_restocking_fee?: any
    paid_from_cash: any
    paid_from_credit: any
  }
}

interface ReturnItem {
  return_price: any
  quantity_returned: any
}

const PreviewCard = ({
  invoiceInfo,
  paymentInfo,
  customerInfo,
  invoiceAddress,
  deliveryAddress,
  products,
  allowPrint,
  totaldata,
}: Props) => {
  const [netamount, setnetamount] = useState<any>('0')
  const [grossamount, setgrossamount] = useState<any>('0')
  const [subtotal, setsubtotal] = useState<any>('0')

  const customerFullname = getFullName(customerInfo)

  useEffect(() => {
    if (netamount && totaldata) {
      const totalVat = parseFloat(totaldata.total_vat)
      const calculatedProductTotal = netamount + totalVat
      setsubtotal(calculatedProductTotal)
    }
  }, [netamount, totaldata])

  useEffect(() => {
    if (subtotal && totaldata?.total_restocking_fee) {
      const subtotalAsNumber = parseFloat(subtotal)
      const totalresfes = parseFloat(
        totaldata.total_restocking_fee,
      )

      if (!isNaN(subtotalAsNumber) && !isNaN(totalresfes)) {
        const calculatedProductTotal = (
          subtotalAsNumber - totalresfes
        ).toFixed(2)
        setgrossamount(calculatedProductTotal)
      }
    }
  }, [subtotal, totaldata])

  useEffect(() => {
    if (totaldata?.return_on?.length) {
      const calculatedProductTotal = (
        totaldata.return_on as ReturnItem[]
      ).reduce(
        (accumulator, product) =>
          accumulator +
          (parseFloat(product.return_price) || 0) *
            (product.quantity_returned || 0),
        0,
      )

      setnetamount(calculatedProductTotal)
    }
  }, [totaldata])

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
      field: 'quantity_returned',
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
      field: 'return_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          <Typography>
            {parseFloat(params.row.return_price).toFixed(2)}
          </Typography>
        </Typography>
      ),
    },
    {
      field: 'restocking_fee',
      headerName: 'R.FEE',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          <Typography>
            {parseFloat(params.row.restocking_fee).toFixed(
              2,
            )}
          </Typography>
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
        <Typography>
          {params.row.return_price *
            params.row.quantity_returned}
        </Typography>
      ),
    },
  ]

  // const { downloadPDF } = useGeneratePDF()

  return (
    <Box>
      {allowPrint && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 5,
          }}
        >
          <Button
            variant='contained'
            onClick={() => console.log('pdf-content')}
          >
            Print
          </Button>
        </Box>
      )}

      <Box
        id='pdf-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,

          border: allowPrint ? '1px solid #ddd' : '',
          py: 8,
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
            <Typography
              variant='h3'
              sx={{ fontWeight: 600, mb: 5 }}
            >
              Nexus Trade
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mb: 5,
              }}
            >
              <Typography>64 ST BARNABAS ROAD</Typography>
              <Typography>LEICESTER</Typography>
              <Typography>LE5 4BD</Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Typography fontWeight={600}>
                  Tel No.
                </Typography>
                <Typography>0116 274 4057</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Typography fontWeight={600}>
                  Email
                </Typography>
                <Typography>
                  sales@nexus-home.com
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxWidth: 340,
              flex: 1,
            }}
          >
            <Typography
              variant='h3'
              fontWeight={600}
              textAlign={'right'}
            >
              Invoice{' '}
              {totaldata?.sale_invoices?.invoice_number}
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
                        flex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
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
            mt: 8,
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
              }}
            >
              <Typography>{customerFullname}</Typography>
              <Typography>
                {invoiceAddress.addressNickName}
              </Typography>
              <Typography>
                {invoiceAddress.addressLine1}
              </Typography>
              {customerInfo.primaryPhone && (
                <Typography>
                  {customerInfo.primaryPhone}
                </Typography>
              )}
              {customerInfo.email && (
                <Typography>
                  {customerInfo.email}
                </Typography>
              )}
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
              <Typography>{customerFullname}</Typography>
              <Typography>
                {deliveryAddress.addressNickName}
              </Typography>
              <Typography>
                {deliveryAddress.addressLine1}
              </Typography>
              {customerInfo.primaryPhone && (
                <Typography>
                  {customerInfo.primaryPhone}
                </Typography>
              )}
              {customerInfo.email && (
                <Typography>
                  {customerInfo.email}
                </Typography>
              )}
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
            minHeight: 400,
            borderBottom: '1.5px solid #ddd',
          }}
        >
          <Box sx={{ border: '1px solid #ddd' }}>
            <AppTable
              headerStyle={{ background: '#dddddd95' }}
              columns={columns}
              rows={products}
              miniColumns={['sku']}
              showToolbar={false}
              pagination={false}
            />
          </Box>
        </Box>

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
            <Typography maxWidth={550}>
              All goods belong to Sharjah Ltd until paid in
              full. Returns accepted up to 30 days form
              invoice date if unused and in the original
              unopened packaging. After 30 days a 25%
              restocking charge will apply. Special order
              items cannot be returned.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                mt: 6,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ maxWidth: 130, flex: 1 }}>
                  Payment terms:
                </Typography>
                <Typography fontWeight={600}>
                  {' '}
                  30 Days EOM
                </Typography>
              </Box>

              <Typography sx={{ fontWeight: 600, mt: 10 }}>
                Bank Details
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ maxWidth: 130, flex: 1 }}>
                  Account Name:
                </Typography>
                <Typography fontWeight={600}>
                  Sharjah Ltd
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ maxWidth: 130, flex: 1 }}>
                  Sort Code:
                </Typography>
                <Typography fontWeight={600}>
                  20-00-00
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ maxWidth: 130, flex: 1 }}>
                  Account Number:
                </Typography>
                <Typography fontWeight={600}>
                  723673223
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
              gap: 2,
              flexDirection: 'column',
              border: '1.5px solid #ddd',
            }}
          >
            <Box sx={{ display: 'flex', lexgap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                Payment Method
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {(paymentInfo || [])
                  .map(payInfo => payInfo.title)
                  .join(', ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                Product Total
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {formatCurrency(netamount)}
              </Typography>
            </Box>
            <Divider />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                Gross Amount
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {formatCurrency(grossamount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                VAT Amount
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {parseFloat(
                  totaldata?.total_vat || 0,
                ).toFixed(2)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                Net Total
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {formatCurrency(netamount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                Restocking Fee
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1 }}
                fontWeight={600}
              >
                {parseFloat(
                  totaldata?.total_restocking_fee || 0,
                ).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1.5px solid #ddd',
            borderBottom: '1.5px solid #ddd',
            py: 6,
            mx: 8,
          }}
        >
          <Typography sx={{ maxWidth: 100 }}>
            Notes:
          </Typography>
          <Typography sx={{ flex: 1 }}>
            {/* Notes Here */}
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
              <Typography>
                Sharjah Ltd Company Number
              </Typography>
              <Typography fontWeight={600}>
                387232
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography>VAT Number</Typography>
              <Typography fontWeight={600}>
                387 232 232
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
            <Typography
              sx={{ maxWidth: 120 }}
              fontWeight={600}
            >
              Salesperson
            </Typography>
            <Typography>Alffie Solomons</Typography>
          </Box>
        </Box>
      </Box>
      {/* </PrintComponent> */}
    </Box>
  )
}

export default PreviewCard
