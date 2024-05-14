import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  paymentInfo?: string
  invoiceTotals: any
  maxWidth?: number
  fontSize?: number
}

const ReceiptsViewTotalSection = ({
  paymentInfo,
  invoiceTotals,
  maxWidth = 300,
  fontSize = 13,
}: Props) => {
  return (
    <Box
      sx={{
        p: 3,
        flex: 1,
        height: 'fit-content',
        maxWidth,
        display: 'flex',
        gap: 0.8,
        flexDirection: 'column',
        border: '1.5px solid #ddd',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography sx={{ fontSize }}>
          Payment Method
        </Typography>
        <Typography
          sx={{ flex: 1, fontSize, textAlign: 'right' }}
          fontWeight={600}
        >
          {paymentInfo || 'To Pay'}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography sx={{ flex: 1, fontSize }}>
          Net Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 80,
            flex: 1,
            fontSize,
            textAlign: 'right',
          }}
          fontWeight={600}
        >
          {formatCurrency(invoiceTotals?.netTotal || 0)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography sx={{ flex: 1, fontSize }}>
          VAT Amount
        </Typography>
        <Typography
          sx={{
            maxWidth: 80,
            flex: 1,
            fontSize,
            textAlign: 'right',
          }}
          fontWeight={600}
        >
          {formatCurrency(invoiceTotals?.vatAmount || 0)}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography sx={{ flex: 1, fontSize }}>
          Gross Total
        </Typography>
        <Typography
          sx={{
            maxWidth: 80,
            flex: 1,
            fontSize,
            textAlign: 'right',
          }}
          fontWeight={600}
        >
          {formatCurrency(invoiceTotals?.grossAmount || 0)}
        </Typography>
      </Box>
    </Box>
  )
}

export default ReceiptsViewTotalSection
