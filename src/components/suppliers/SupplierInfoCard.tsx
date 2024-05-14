import { Box, Card, Typography } from '@mui/material'

// import Image from 'next/image'
import React from 'react'

import Icon from 'src/@core/components/icon'
import { formatCurrency } from 'src/utils/formatCurrency'
import CustomTag from '../global/CustomTag'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { ISupplier } from 'src/models/ISupplier'
import { timeToAMPM } from 'src/utils/dateUtils'

interface Props {
  supplierData: ISupplier
}

const MoneyCard = ({
  amount,
  label,
  color = 'success',
}: {
  amount: number
  label: string
  color?: 'error' | 'success'
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 1.5,
      px: 3,
      border: '1.5px dashed #96969685',
      borderRadius: 1,
      textAlign: 'center',
      width: 200,
    }}
  >
    <Typography sx={{ fontWeight: 600 }}>
      {formatCurrency(amount)}
    </Typography>
    <CustomTag label={label} color={color} />
  </Box>
)

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

const SupplierInfoCard = ({ supplierData }: Props) => {
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
                {supplierData.name}
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
              <Typography>{supplierData.id}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'space-between',
            }}
          >
            <MoneyCard
              amount={Number(supplierData.current_credit)}
              label='Available'
            />

            <MoneyCard
              amount={Number(supplierData.credit_limit)}
              label='Balance'
              color={
                Number(supplierData.current_credit) >
                Number(supplierData.credit_limit)
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
              label={supplierData.email}
            />
            <Property
              icon='tabler:phone'
              label={supplierData.primary_phone}
            />
            <Property
              icon='tabler:clock'
              label={`Mon-Fri ${timeToAMPM(
                supplierData.opening_hours,
                'h:mma',
              )} - ${timeToAMPM(
                supplierData.closing_hours,
                'h:mma',
              )}`}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default SupplierInfoCard
