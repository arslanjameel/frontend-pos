import React from 'react'
import { Box, Typography } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'
import { IPayInfo, IPayTypes } from 'src/types/IPayInfo'

interface Props {
  pay: IPayInfo
  onChange: (
    id: IPayTypes,
    secType: 'amount' | 'extraAmount',
    value: number,
  ) => void
  sum?: number
  customerCredit?: number
  readOnly?: boolean
}

const PayOptionInputs = ({
  pay,
  onChange,
  customerCredit,
  readOnly,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 5,
          rowGap: 0,
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{ minWidth: 50 }}
        >
          {pay.title}
        </Typography>
        <CustomTextField
          sx={{ maxWidth: 120, minWidth: 100 }}
          type='number'
          value={pay.amount > 0 ? pay.amount : ''}
          placeholder='0'
          onChange={e =>
            onChange(
              pay.id,
              'amount',
              Number(e.target.value),
            )
          }
          InputProps={{ readOnly }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 5,
          rowGap: 0,
        }}
      >
        {pay.extraAmount && pay.extraTitle ? (
          <>
            <Typography
              variant='subtitle1'
              sx={{ minWidth: 100 }}
            >
              {pay.extraTitle}
            </Typography>
            <CustomTextField
              InputProps={{ readOnly: true }}
              sx={{ maxWidth: 120, minWidth: 100 }}
              type={pay.extraTitle ? 'number' : 'hidden'}
              value={
                customerCredit
                  ? (customerCredit - pay.amount).toFixed(2)
                  : 0
              }
              placeholder='0'
              onChange={e =>
                onChange(
                  pay.id,
                  'extraAmount',
                  Number(e.target.value),
                )
              }
            />
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}

export default PayOptionInputs
