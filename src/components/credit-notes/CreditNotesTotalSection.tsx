import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  netAmount: number
  vatAmount: number
  subTotal: number
  totalRestockingFee: number
  grossAmount: number
  invoicePaidAmount: number
  refundMethod?: string
  fontSize?: number
  maxWidth?: number
  withBorder?: boolean
}

const CreditNotesTotalSection = ({
  netAmount,
  vatAmount,
  subTotal,
  totalRestockingFee,
  grossAmount,
  invoicePaidAmount,
  refundMethod,
  fontSize = 13,
  maxWidth = 250,
  withBorder = true,
}: Props) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 'fit-content',
        maxWidth,
        ml: 'auto',
        display: 'flex',
        gap: 2,
        p: 3,
        flexDirection: 'column',
        border: withBorder ? '1.5px solid #ddd' : '',
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          Refund Method
        </Typography>
        <Typography
          sx={{ flex: 1, fontSize, textAlign: 'center' }}
          fontWeight={600}
        >
          {refundMethod}
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          Net Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
          }}
        >
          {formatCurrency(netAmount)}
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          VAT Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
          }}
        >
          {formatCurrency(vatAmount)}
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          Subtotal
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
          }}
        >
          {formatCurrency(subTotal)}
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          Invoice Paid Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
          }}
        >
          {formatCurrency(invoicePaidAmount)}
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
          sx={{ textAlign: 'left', fontSize, flex: 1 }}
        >
          Restocking Fee
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
          }}
        >
          -{formatCurrency(totalRestockingFee)}
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
            fontSize,
            fontWeight: 600,
          }}
        >
          Gross Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 85,
            flex: 1,
            fontSize,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {formatCurrency(grossAmount)}
        </Typography>
      </Box>
    </Box>
  )
}

export default CreditNotesTotalSection
