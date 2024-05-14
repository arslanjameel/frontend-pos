import { Box, Typography } from '@mui/material'
import React from 'react'

import { ISupplierBankInfo } from 'src/models/ISupplier'

interface Props {
  title?: string
  actionBtns?: React.ReactNode
  bankInfo: ISupplierBankInfo
}

const Item = ({
  label,
  value,
}: {
  label: string
  value: string
}) => (
  <Box
    sx={{
      minWidth: 140,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Typography variant='h6' fontWeight={600}>
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: 15,
        letterSpacing: 0,
        color: '#959495da',
      }}
    >
      {value}
    </Typography>
  </Box>
)

const BankInfo = ({
  title,
  actionBtns,
  bankInfo,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant='h5' fontWeight={600}>
            {title}
          </Typography>

          {actionBtns && actionBtns}
        </Box>
      )}

      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <Item
          label='Company Number'
          value={bankInfo.company_number || '--'}
        />
        <Item
          label='VAT Number'
          value={bankInfo.vat_number || '--'}
        />
      </Box>

      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <Item
          label='Bank Account Name'
          value={bankInfo.bank_account_name || '--'}
        />
        <Item
          label='Account Number'
          value={`${bankInfo.account_number}` || '--'}
        />
        <Item
          label='Sort Code'
          value={bankInfo.sort_code || '--'}
        />
      </Box>
    </Box>
  )
}

export default BankInfo
