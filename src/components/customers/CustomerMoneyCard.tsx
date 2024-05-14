import { Box, SxProps, Typography } from '@mui/material'
import React from 'react'

import { formatCurrency } from 'src/utils/formatCurrency'
import CustomTag from '../global/CustomTag'

const CustomerMoneyCard = ({
  amount,
  label,
  color = 'success',
  sx = {},
  stretch = false,
}: {
  amount: number | 'N/A'
  label: string
  color?: 'error' | 'success'
  sx?: SxProps
  stretch?: boolean
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      py: 2,
      px: 3,
      border: '1.5px dashed #96969685',
      borderRadius: 1,
      textAlign: 'center',
      width: 200,
      flex: stretch ? 1 : 'initial',
      maxWidth: 230,
      ...sx,
    }}
  >
    <Typography sx={{ fontWeight: 600 }}>
      {amount === 'N/A'
        ? 'N/A'
        : formatCurrency(Number(amount))}
    </Typography>
    <CustomTag
      label={label}
      color={color}
      sx={{ width: stretch ? '100%' : 'fit-content' }}
    />
  </Box>
)

export default CustomerMoneyCard
