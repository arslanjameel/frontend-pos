'use client'
import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { formatCurrency } from 'src/utils/formatCurrency'
import {
  COMPANY_NUMBER,
  COMPANY_VAT_NUMBER,
} from 'src/utils/globalConstants'
import CurrentStoreName from '../global/CurrentStoreName'
import CurrentStoreAddress from '../global/CurrentStoreAddress'
import AppTable from '../global/AppTable'
import PaidAmountSection from './PaidAmountSection'
import { IPayInfo } from 'src/types/IPayInfo'
import { getApiStylePaymentMethods } from 'src/utils/invoicesUtils'
import ReceiptsViewTotalSection from './ReceiptsViewTotalSection'

interface Props {
  title: string
  receiptInfo: {
    [key: string]: string
  }
  invoiceTotals?: {
    grossAmount: number
    vatAmount: number
    netTotal: number
  }
  products: any[]
  paymentInfo?: string
  allowPrint?: boolean
  paymentData?: IPayInfo[]
}

const ReceiptsPreviewCard = ({
  title,
  receiptInfo,
  invoiceTotals,
  paymentInfo,
  paymentData,
  products,
  allowPrint,
}: Props) => {
  const columns: GridColDef[] = [
    {
      field: 'invoice_number',
      headerName: 'Invoice No.',
      type: 'string',
      minWidth: 100,
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
      field: 'amount_cleared',
      headerName: 'Amount Cleared',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      width: 250,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  return (
    <Box>
      <Box
        id='pdf-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

          border: allowPrint ? '1px solid #ddd' : '',
          py: 8,
          minHeight: 800,
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
              {Object.entries(receiptInfo).map(
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
                          Object.entries(receiptInfo)
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
                          Object.entries(receiptInfo)
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
        // * Products Section
        // *
        // *
      */}
        <Box
          sx={{
            mx: 8,
            pb: 8,
            mt: 5,
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

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 3,
            px: 8,
          }}
        >
          <PaidAmountSection
            totalPayment={invoiceTotals?.grossAmount || 0}
            paymentsObj={getApiStylePaymentMethods(
              paymentData || [],
            )}
          />

          <ReceiptsViewTotalSection
            paymentInfo={paymentInfo}
            invoiceTotals={invoiceTotals}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mx: 8,
          mb: 4,
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
        ></Box>
      </Box>
    </Box>
  )
}

export default ReceiptsPreviewCard
