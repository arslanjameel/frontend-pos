import { Box, Card, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'

import UseBgColor from 'src/@core/hooks/useBgColor'
import {
  IPayInfo,
  IPayTypes,
  PayTypes,
} from 'src/types/IPayInfo'
import PayOption from '../global/PayOption'
import PayOptionInputs from '../global/PayOptionInputs'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  paymentData: IPayInfo[]
  totalAmount?: number[]
  total: number
  onChange: (value: IPayInfo[]) => void
  customercredit: number
}

const paymentOptions = [
  {
    id: PayTypes.Cash,
    title: 'Cash',
    icon: 'tabler:cash-banknote',
  },
  {
    id: PayTypes.Card,
    title: 'Card',
    icon: 'tabler:credit-card',
  },
  {
    id: PayTypes.BACS,
    title: 'BACS',
    icon: 'tabler:building-bank',
  },
  {
    id: PayTypes.Credit,
    title: 'Credit',
    icon: 'tabler:wallet',
  },
]

const CreditPaymentCard = ({
  paymentData = [],
  onChange,
  customercredit,
  total,
}: Props) => {
  const [amountRemaining, setAmountRemaining] =
    useState(total)

  const { errorLight } = UseBgColor()

  useEffect(() => {
    let _amountRemaining = total

    paymentData.forEach(pay => {
      _amountRemaining -= pay.amount
    })

    setAmountRemaining(_amountRemaining)
  }, [paymentData, total, customercredit])

  const addPaymentOption = (id: IPayTypes) => {
    const tempPaymentData = [...paymentData]

    const isPresent = paymentData
      .map(pay => pay.id)
      .includes(id)

    if (!isPresent) {
      switch (id) {
        case PayTypes.Credit:
          tempPaymentData.push({
            id,
            title: 'Credit',
            amount: 0,
            extraTitle: 'Remaining',
            extraAmount: customercredit,
          })
          break
        case PayTypes.Cash:
          tempPaymentData.push({
            id,
            title: 'Cash',
            amount: 0,
          })
          break
        case PayTypes.Card:
          tempPaymentData.push({
            id,
            title: 'Card',
            amount: 0,
          })
          break
        case PayTypes.BACS:
          tempPaymentData.push({
            id,
            title: 'BACS',
            amount: 0,
          })
          break

        default:
          break
      }
    }
    onChange(tempPaymentData)
  }

  const updatePaymentData = (
    id: number,
    key: 'amount' | 'extraAmount',
    value: number,
  ) => {
    const tempData = paymentData.map(data =>
      data.id === id ? { ...data, [key]: value } : data,
    )

    onChange(tempData)
  }

  const removePaymentOption = (id: number) => {
    onChange(paymentData.filter(pay => pay.id !== id))
  }

  return (
    <Card
      sx={{
        p: 4,
        px: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
      }}
    >
      <Typography variant='h5' fontWeight={600}>
        Add Payment
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 3,
          }}
        >
          {paymentOptions.map(option => (
            <PayOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              active={paymentData
                .map(pay => pay.id)
                .includes(option.id)}
              onClick={() =>
                paymentData
                  .map(pay => pay.id)
                  .includes(option.id)
                  ? removePaymentOption(option.id)
                  : addPaymentOption(option.id)
              }
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          my: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {paymentData.map(pay => (
          <PayOptionInputs
            key={pay.id}
            pay={pay}
            onChange={updatePaymentData}
            customerCredit={customercredit}
          />
        ))}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          background: errorLight.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 4,
          py: 2,
        }}
      >
        <Typography
          variant='h4'
          sx={{ fontWeight: 600, color: errorLight.color }}
        >
          Amount Due
        </Typography>
        <Typography
          variant='h4'
          sx={{ fontWeight: 600, color: errorLight.color }}
        >
          {formatCurrency(amountRemaining)}
        </Typography>
      </Box>
    </Card>
  )
}

export default CreditPaymentCard
