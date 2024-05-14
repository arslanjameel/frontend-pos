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

// import // getFullName,

// calculatequoteTotals,
// 'src/utils/dataUtils'

// import { ISaleProduct } from 'src/models/IProduct'
// import { useGetCustomerAddressesQuery } from 'src/store/apis/customersSlice'
// import { isCashCustomer } from 'src/utils/customers.util'
// import { ICustomer } from 'src/models/ICustomer'
// import AddressName from '../global/ValueComponents/AddressName'
import {
  COMPANY_NUMBER,
  COMPANY_VAT_NUMBER,
} from 'src/utils/globalConstants'
import CurrentStoreName from '../global/CurrentStoreName'
import CurrentStoreAddress from '../global/CurrentStoreAddress'
import AppTable from '../global/AppTable'
import { excludeVAT } from 'src/utils/dataUtils'

// import { downloadPDF } from 'src/utils/pdfUtils'

interface Props {
  title: string
  quoteInfo: {
    [key: string]: string
  }
  quoteTotals?: {
    grossAmount: number
    vatAmount: number
    netTotal: number
  }
  products: any[]
  totalsData?: {
    gross: number
    net: number
    vat: number
    sub: number
  }
  notes: string
  delivery?: number
  customerInfo?: IData
  quotationAddress: string
  allowPrint?: boolean
  allowEmail?: boolean
  downloadAction?: () => void
  closeAction?: () => void
}

const QuotesPreviewCard = ({
  title,
  quoteInfo,
  quoteTotals,

  // customerInfo,
  quotationAddress,
  notes,
  products,
  allowPrint,
  allowEmail,
  downloadAction,
  closeAction,
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
      field: 'quantity',
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
                // handleGeneratePdf()
                closeAction && closeAction()

                // downloadPDF('pdf-content')
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
              {Object.entries(quoteInfo).map((info, i) => (
                <Box key={info[0]} sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.3,
                      border: '1.5px solid #8f8f8f94',
                      borderBottom:
                        Object.entries(quoteInfo).length !==
                        i + 1
                          ? 'none'
                          : '1.5px solid #8f8f8f94',
                      flex: 2,
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
                        Object.entries(quoteInfo).length !==
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
              ))}
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
              Quotation Address:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                fontSize: 13,
              }}
            >
              {quotationAddress.split('\n').map(val => (
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
          ></Box>
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
            borderTop: '1px solid #b8b8b8',
            pt: 5,
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
            <Box
              sx={{
                maxWidth: 300,
                border: '2px solid #b8b8b8',
                textAlign: 'center',
                padding: 5,
              }}
            >
              <Typography
                maxWidth={550}
                fontWeight={600}
                fontSize={13}
              >
                **** QUOTATION ONLY ***
              </Typography>
              <Typography
                maxWidth={550}
                fontWeight={600}
                fontSize={13}
              >
                **** NO GOODS TO BE ISSUED ***
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                mt: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,

                  flex: 1,
                }}
              >
                The quotation may be subject to price
                changes
              </Typography>
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ flex: 1, fontSize: 13 }}>
                Net Amount
              </Typography>
              <Typography
                sx={{ maxWidth: 80, flex: 1, fontSize: 13 }}
                fontWeight={600}
              >
                {formatCurrency(quoteTotals?.netTotal || 0)}
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
                  quoteTotals?.vatAmount || 0,
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
                  quoteTotals?.grossAmount || 0,
                )}
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
            py: 3,
            mx: 8,
          }}
        >
          <Typography sx={{ maxWidth: 100, fontSize: 13 }}>
            Notes:
          </Typography>
          <Typography sx={{ flex: 1, fontSize: 13 }}>
            {notes || ''}
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
                Company Reg No
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
                VAT Reg Number
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
          ></Box>
        </Box>
      </Box>
    </Box>
  )
}

export default QuotesPreviewCard
