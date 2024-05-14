import React from 'react'
import { Box, Typography } from '@mui/material'

import useGetCityName from 'src/hooks/useGetCityName'
import { useGetCitiesQuery } from 'src/store/apis/accountSlice'
import { useAppSelector } from 'src/store/hooks'
import capitalize from 'src/utils/capitalize'

interface Props {
  withMoreInfo?: boolean
}

const CurrentStoreAddress = ({ withMoreInfo }: Props) => {
  const { store } = useAppSelector(state => state.app)

  const { data: cities } = useGetCitiesQuery()
  const { getCity } = useGetCityName(cities || [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box>
        <Typography fontSize={13.5}>
          {capitalize(
            store?.storeAddress || 'Store Address',
          )}
        </Typography>
        <Typography fontSize={13.5}>
          {getCity(store?.city) || 'City'}
        </Typography>
        <Typography fontSize={13.5}>
          {store?.postalCode || 'Post Code'}
        </Typography>
      </Box>

      {withMoreInfo && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography fontSize={13.5} fontWeight={600}>
              Tel No.
            </Typography>
            <Typography fontSize={13.5}>
              {store?.phone || 'Phone'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography fontSize={13} fontWeight={600}>
              Email
            </Typography>
            <Typography fontSize={13}>
              {store?.email || 'Email'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CurrentStoreAddress
