import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'

import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTag from './CustomTag'
import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import ResponsiveButton from './ResponsiveButton'
import { IAddress } from 'src/models/IAddress'
import useGetCountryName from 'src/hooks/useGetCountryName'
import { sortAddressesByDate } from 'src/utils/addressUtils'

interface Props {
  addresses: IAddress[]
  activeAddress: number
  onChange: (id: number) => void
  onAddInit: (_: any) => void
  onEditInit: (address: IAddress) => void
  onDeleteInit: (id: number) => void
}

const AddressListMini = ({
  addresses,
  activeAddress,
  onChange,
  onAddInit,
  onEditInit,
  onDeleteInit,
}: Props) => {
  const { getCountry } = useGetCountryName()

  const { isMobileSize } = useWindowSize()
  const { primaryLight, secondaryLight } = UseBgColor()

  const getFullAddress = (address: IAddress) => {
    return `${address.addressLine1}, ${getCountry(
      address.country,
    )}, ${address.postCode}`
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant='h5' fontWeight={600}>
          Stored Addresses
        </Typography>

        <ResponsiveButton
          mini={isMobileSize}
          size='small'
          variant='tonal'
          icon='tabler:plus'
          onClick={onAddInit}
          label='Add New Address'
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 3,
        }}
      >
        {sortAddressesByDate(addresses).map(address => (
          <Box
            key={address.id}
            sx={{
              background:
                address.id === activeAddress
                  ? primaryLight.backgroundColor
                  : 'transparent',
              border: `1px solid ${
                address.id === activeAddress
                  ? primaryLight.color
                  : secondaryLight.color
              }`,
              display: 'flex',
              flexDirection: isMobileSize
                ? 'column'
                : 'row',
              alignItems: isMobileSize ? 'left' : 'center',
              gap: 2.5,
              borderRadius: 1,
              py: 3,
              px: 1,
              pl: 3,
              cursor: 'pointer',
            }}
            onClick={() =>
              onChange(
                address.id === activeAddress
                  ? 0
                  : address.id,
              )
            }
          >
            <Typography
              sx={{
                color:
                  address.id === activeAddress
                    ? primaryLight.color
                    : 'inherit',

                width: 100,
                fontWeight: 500,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {address?.addressNickName}
            </Typography>

            <Box
              sx={{
                flex: 3.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography
                sx={{
                  color:
                    address.id === activeAddress
                      ? primaryLight.color
                      : 'inherit',
                }}
              >
                {getFullAddress(address)}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {address?.defaultShipping && (
                  <CustomTag
                    label='Default Shipping'
                    size='small'
                    sx={{ fontSize: 13 }}
                  />
                )}
                {address?.defaultBilling && (
                  <CustomTag
                    label='Default Billing'
                    size='small'
                    sx={{ fontSize: 13 }}
                  />
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <IconButton
                color='primary'
                onClick={e => {
                  e.stopPropagation()
                  onEditInit(address)
                }}
              >
                <Icon icon='tabler:edit' />
              </IconButton>
              <IconButton
                color='error'
                onClick={e => {
                  e.stopPropagation()
                  if (address.id) onDeleteInit(address.id)
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          </Box>
        ))}

        {addresses.length === 0 && (
          <Typography sx={{ fontStyle: 'italic' }}>
            Customer has no addresses
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default AddressListMini
