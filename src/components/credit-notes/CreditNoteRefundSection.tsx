import { Box, Typography } from '@mui/material'
import React from 'react'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  paymentToCustomer: number
  paymentsObj: any
  fontSize?: number
}

const CreditNoteRefundSection = ({
  paymentToCustomer,
  paymentsObj,
  fontSize = 13,
}: Props) => {
  const { isMobileSize } = useWindowSize()

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 3,
        maxWidth: 300,
        width: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
          pb: isMobileSize ? 6 : 0,
          minWidth: 'fit-content',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography
            sx={{
              textAlign: 'left',
              flex: 1,
              maxWidth: 120,
              fontSize,
            }}
          >
            Refund Amount
          </Typography>
          <Typography sx={{ flex: 1, fontSize }}>
            {formatCurrency(paymentToCustomer)}
          </Typography>
        </Box>

        {(paymentsObj?.paid_from_credit || 0) > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              sx={{
                textAlign: 'left',
                flex: 1,
                maxWidth: 120,
                fontSize,
              }}
            >
              Credit
            </Typography>
            <Typography sx={{ flex: 1, fontSize }}>
              {formatCurrency(
                paymentsObj?.paid_from_credit || 0,
              )}
            </Typography>
          </Box>
        )}

        {(paymentsObj?.paid_from_cash || 0) > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              sx={{
                textAlign: 'left',
                flex: 1,
                maxWidth: 120,
                fontSize,
              }}
            >
              Cash
            </Typography>
            <Typography sx={{ flex: 1, fontSize }}>
              {formatCurrency(
                paymentsObj?.paid_from_cash || 0,
              )}
            </Typography>
          </Box>
        )}

        {(paymentsObj?.paid_from_bacs || 0) > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              sx={{
                textAlign: 'left',
                flex: 1,
                maxWidth: 120,
                fontSize,
              }}
            >
              Cash
            </Typography>
            <Typography sx={{ flex: 1, fontSize }}>
              {formatCurrency(
                paymentsObj?.paid_from_bacs || 0,
              )}
            </Typography>
          </Box>
        )}

        {(paymentsObj?.paid_from_card || 0) > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              sx={{
                textAlign: 'left',
                flex: 1,
                maxWidth: 120,
                fontSize,
              }}
            >
              Card
            </Typography>
            <Typography sx={{ flex: 1, fontSize }}>
              {formatCurrency(
                paymentsObj?.paid_from_card || 0,
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CreditNoteRefundSection
