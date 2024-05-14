import React from 'react'
import { Box, Card, Typography } from '@mui/material'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'
import CustomerMoneyCard from '../customers/CustomerMoneyCard'
import CustomTextField from 'src/@core/components/mui/text-field'
import { ICustomer } from 'src/models/ICustomer'
import { isCashCustomer } from 'src/utils/customers.util'

interface Props {
  title?: string
  selectedCustomer: ICustomer
  referenceValue?: string
  setReferenceValue?: (newValue: string) => void
}

const CustomerDetailsCard = ({
  title = 'Customer Details',
  selectedCustomer,
  referenceValue,
  setReferenceValue,
}: Props) => {
  const availableBalence = (
    current: string,
    limit: string,
  ) => {
    const currentNum = parseFloat(current)
    const limitNum = parseFloat(limit)
    const availableNum = limitNum - currentNum

    return availableNum
  }

  return (
    <Card
      sx={{
        height: '100%',
        pb: 4,
        px: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          my: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Icon icon='tabler:user' />
          <Typography variant='h5' fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontWeight: 600 }}
          color={
            isCashCustomer(selectedCustomer)
              ? 'primary'
              : 'inherit'
          }
        >
          {!isCashCustomer(selectedCustomer) ? (
            <Link
              href={`/customers/${selectedCustomer.id}`}
            >{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</Link>
          ) : (
            `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
          )}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Icon icon='tabler:id' />
          <Typography sx={{ fontWeight: 600 }}>
            {selectedCustomer.id}
          </Typography>
        </Box>
      </Box>

      {!isCashCustomer(selectedCustomer) &&
        selectedCustomer?.id != 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <CustomerMoneyCard
              amount={
                availableBalence(
                  selectedCustomer.currentCredit,
                  selectedCustomer.creditLimit,
                ) || ('N/A' as any)
              }
              label='Available'
              color='success'
              stretch
              sx={{ maxWidth: '150px !important' }}
            />
            <CustomerMoneyCard
              amount={
                Number(selectedCustomer.currentCredit) ||
                'N/A'
              }
              label='Balance'
              color='error'
              stretch
              sx={{ maxWidth: '150px !important' }}
            />
          </Box>
        )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ minWidth: 120 }}>
          Customer Ref
        </Typography>
        <CustomTextField
          placeholder='Reference'
          value={referenceValue}
          onChange={e =>
            setReferenceValue &&
            setReferenceValue(e.target.value)
          }
        />
      </Box>
    </Card>
  )
}

export default CustomerDetailsCard
