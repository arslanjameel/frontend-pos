import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import useClipboard from 'src/@core/hooks/useClipboard'

interface Props {
  title?: string
  actionBtns?: React.ReactNode
  address: {
    addressName: string
    addressLine: string
    postCode?: string
    city: string
    country: string
  }
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
    <Typography sx={{ fontSize: 15, color: '#959495da' }}>
      {value || '--'}
    </Typography>
  </Box>
)

const AddressInfo = ({
  title,
  actionBtns,
  address,
}: Props) => {
  const copyAddress = useClipboard()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant='h5'
            fontWeight={600}
            marginBottom={4}
          >
            {title}
          </Typography>

          {actionBtns && actionBtns}
        </Box>
      )}
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <Box sx={{ minWidth: 160, flex: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              Full Address
            </Typography>
            <IconButton
              color='primary'
              size='small'
              onClick={() => {
                copyAddress.copy(address.addressName)
                toast.success('Address copied')
              }}
            >
              <Icon icon='tabler:copy' />
            </IconButton>
          </Box>
          <Typography
            sx={{ fontSize: 15, color: '#959495da' }}
          >
            {address.addressName || '--'}
          </Typography>
        </Box>
        <Box
          sx={{
            minWidth: 140,
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Item
            label='Address Line'
            value={address.addressLine || '--'}
          />
          <Item
            label='Post Code'
            value={address.postCode || '--'}
          />
        </Box>
        <Box
          sx={{
            minWidth: 100,
            width: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flex: 2,
          }}
        >
          <Item label='City' value={address.city} />
          <Item label='Country' value={address.country} />
        </Box>
      </Box>
    </Box>
  )
}

export default AddressInfo
