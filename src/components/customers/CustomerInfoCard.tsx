import { Box, Card, Typography } from '@mui/material'
import React from 'react'

// import Image from 'next/image'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import CustomerMoneyCard from './CustomerMoneyCard'
import { ICustomer, PriceBand } from 'src/models/ICustomer'
import { getCustomerAvailableBalance } from 'src/utils/customers.util'

interface Props {
  customerData: ICustomer
}

const Property = ({
  icon,
  label,
}: {
  icon: string
  label: string
}) => (
  <Typography
    sx={{
      height: 22,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: '#8a8a8a',
    }}
  >
    <Icon icon={icon} /> {label}
  </Typography>
)

const CustomerInfoCard = ({ customerData }: Props) => {
  const { isWindowBelow } = useWindowSize()

  return (
    <Card
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: isWindowBelow(743)
          ? 'column'
          : 'row',
        alignItems: isWindowBelow(743)
          ? 'center'
          : 'flex-start',
        gap: 4,
      }}
    >
      {/* <Image
        src={'/images/avatars/person1.png'}
        alt='person'
        height={100}
        width={100}
      /> */}

      <Box
        sx={{
          py: 1,
          flex: 1,
          display: 'flex',
          flexDirection: isWindowBelow(743)
            ? 'column'
            : 'row',
          gap: 5,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            margin: isWindowBelow(743) ? 'auto' : 'initial',
            maxWidth: 250,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'space-between',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Typography variant='h5' fontWeight={600}>
                {customerData.accountName}
              </Typography>
              <Icon icon='tabler:discount-check' />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Icon icon='tabler:id' />
              <Typography>{customerData.id}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'space-between',
            }}
          >
            <CustomerMoneyCard
              amount={getCustomerAvailableBalance(
                customerData,
              )}
              label='Available'
            />

            <CustomerMoneyCard
              amount={Math.fround(
                Number(customerData.currentCredit),
              )}
              label='Balance'
              color={
                Number(customerData.currentCredit) >
                Number(customerData.creditLimit)
                  ? 'error'
                  : 'success'
              }
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: isWindowBelow(743)
              ? 'center'
              : 'flex-end',
            flex: 1,
            minWidth: 300,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: isWindowBelow(743)
                ? 'center'
                : 'flex-end',
              columnGap: 4,
              rowGap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Property
              icon='tabler:mail'
              label={customerData.email}
            />
            <Property
              icon='tabler:phone'
              label={customerData.primaryPhone}
            />
            <Property
              icon='tabler:currency-pound'
              label={`Price Band ${
                PriceBand[customerData.priceBand]
              }`}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default CustomerInfoCard
