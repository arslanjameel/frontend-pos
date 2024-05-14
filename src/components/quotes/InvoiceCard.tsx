import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import AppTable from '../global/AppTable'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import { getFullName } from 'src/utils/dataUtils'
import { IPayInfo } from 'src/types/IPayInfo'
import { ISaleProduct } from 'src/models/IProduct'
import { useGetCustomerAddressesQuery } from 'src/store/apis/customersSlice'
import { dateToString } from 'src/utils/dateUtils'
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
} from 'src/store/apis/accountSlice'
import useGetCityName from 'src/hooks/useGetCityName'
import useGetCountryName from 'src/hooks/useGetCountryName'

interface Props {
  products: ISaleProduct[]
  totalsData: {
    gross: number
    net: number
    vat: number
    sub: number
  }
  delivery?: number
  discount?: number
  amountDue?: number
  paymentInfo?: IPayInfo[]
  customerInfo: IData
  invoiceAddress: number
  deliveryAddress: number
}

const InvoiceCard = ({
  products,
  totalsData,
  amountDue = 0,
  delivery = 0,
  discount = 0,
  paymentInfo = [],
  invoiceAddress,
  deliveryAddress,
  customerInfo,
}: Props) => {
  const { data: addresses } = useGetCustomerAddressesQuery()
  const { data: cities } = useGetCitiesQuery()
  const { data: countries } = useGetCountriesQuery()

  const { getCountry } = useGetCountryName(
    countries ? countries : [],
  )
  const { getCity } = useGetCityName(cities ? cities : [])

  const getAddress = (id: number) => {
    return (addresses ? addresses.results : []).find(
      addr => addr.id === id,
    )
  }

  const customerFullname = getFullName(customerInfo)

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
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  const getAddressFull = (addressId: number) => {
    return (
      (getAddress(addressId)?.postCode || '--') +
      ' ' +
      (getCity(getAddress(addressId)?.city || 0) || '--') +
      ', ' +
      (getCountry(getAddress(addressId)?.country || 0) ||
        '--')
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        border: '1px solid #ddd',
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
            Store
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography>Store Street Address</Typography>
            <Typography>City, Postcode</Typography>
            <Typography>Phone Number</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 300,
          }}
        >
          <Typography variant='h3' fontWeight={600}>
            Quotes
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Date Issued:
            </Typography>
            <Typography fontWeight={600}>
              {dateToString(new Date(), 'dd/MM/yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Time:
            </Typography>
            <Typography fontWeight={600}>
              {dateToString(new Date(), 'HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Customer No:
            </Typography>
            <Typography fontWeight={600}>
              GHSWIJY767
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Customer Ref:
            </Typography>
            <Typography fontWeight={600}>
              Tile Buster 23rd May 2003
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 8,
        }}
      >
        <Box>
          <Typography variant='h5' marginBottom={2}>
            Invoice Address:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography>{customerFullname}</Typography>
            <Typography>
              {getAddress(invoiceAddress)
                ?.addressNickName || '--'}
            </Typography>
            <Typography>
              {getAddressFull(invoiceAddress)}
            </Typography>
            {customerInfo.primaryPhone && (
              <Typography>
                {customerInfo.primaryPhone}
              </Typography>
            )}
            {customerInfo.email && (
              <Typography>{customerInfo.email}</Typography>
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
          <Typography variant='h5'>
            Delivery Address:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography>{customerFullname}</Typography>
            <Typography>
              {getAddress(deliveryAddress)
                ?.addressNickName || '--'}
            </Typography>
            <Typography>
              {getAddressFull(deliveryAddress)}
            </Typography>
            {customerInfo.primaryPhone && (
              <Typography>
                {customerInfo.primaryPhone}
              </Typography>
            )}
            {customerInfo.email && (
              <Typography>{customerInfo.email}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ border: '1px solid #ddd', mx: 8 }}>
        <AppTable
          columns={columns}
          rows={products}
          miniColumns={['sku']}
          showToolbar={false}
          pagination={false}
        />
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
            <Typography
              variant='h5'
              sx={{ fontWeight: 600 }}
            >
              Bank Details
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography sx={{ maxWidth: 130, flex: 1 }}>
                Account Name:
              </Typography>
              <Typography fontWeight={600}>
                Sharjah Ltd
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography sx={{ maxWidth: 130, flex: 1 }}>
                Sort Code:
              </Typography>
              <Typography fontWeight={600}>
                20-00-00
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
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
            flex: 1,
            maxWidth: 250,
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
            <Typography>Payment Method:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {paymentInfo
                .map(payInfo => payInfo.title)
                .join(', ')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Typography>Discount:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(discount)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Typography>Net Amount:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(totalsData.net)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Typography>VAT Amount:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(totalsData.vat)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Typography>Delivery:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(delivery)}
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
            <Typography>Gross Total:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(totalsData.gross)}
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
            <Typography>Amount Due:</Typography>
            <Typography
              sx={{ maxWidth: 80, flex: 1 }}
              fontWeight={600}
            >
              {formatCurrency(amountDue)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #ddd',
          borderBottom: '1px solid #ddd',
          py: 6,
          px: 8,
        }}
      >
        <Typography sx={{ maxWidth: 100 }}>
          Notes:
        </Typography>
        <Typography sx={{ flex: 1 }}></Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 8,
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
            <Typography fontWeight={600}>387232</Typography>
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
  )
}

export default InvoiceCard
