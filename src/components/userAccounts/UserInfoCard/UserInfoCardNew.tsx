import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  IUserStatus,
  UserStatusColor,
} from 'src/models/IUser'

// import ImageWithUpload from './ImageWithUpload'
import CustomTag from 'src/components/global/CustomTag'
import { getRoleName } from 'src/utils/dataUtils'
import {
  useGetCountriesQuery,
  useGetUserTypesQuery,
} from 'src/store/apis/accountSlice'
import UserStatusTag from '../UserStatusTag'
import useGetCountryName from 'src/hooks/useGetCountryName'
import { dateToString } from 'src/utils/dateUtils'

interface Props {
  userData: {
    fullName: string
    email: string
    user_type: number
    status: IUserStatus
    country: number
    createdAt: string
  }
  allowStatusUpdate?: boolean
  openStatusModal?: () => void

  actionBtns?: React.ReactNode

  selectedImage: string | null
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  resetImage?: () => void
}

const UserInfoCardNew = ({
  userData,
  actionBtns,
  allowStatusUpdate,
  openStatusModal,
}: // selectedImage,
// handleImageChange,
// resetImage,
Props) => {
  const { isMobileSize } = useWindowSize()
  const { data: roles } = useGetUserTypesQuery()

  const { data: countries } = useGetCountriesQuery()
  const { getCountry } = useGetCountryName(
    countries ? countries : [],
  )

  return (
    <Card
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: isMobileSize ? 'column' : 'row',
        gap: 3,
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobileSize ? 'column' : 'row',
          alignItems: isMobileSize ? 'center' : 'flex-end',
          gap: 4,
        }}
      >
        {/* <ImageWithUpload
          legacy
          selectedImage={selectedImage}
          handleImageChange={handleImageChange}
          resetImage={resetImage}
        /> */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobileSize
              ? 'center'
              : 'flex-end',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 17,
              textAlign: isMobileSize ? 'center' : 'left',
            }}
          >
            {userData.fullName}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: isMobileSize
                ? 'center'
                : 'flex-start',
            }}
          >
            <CustomTag
              label={getRoleName(
                roles ? roles.results : [],
                userData.user_type,
              )}
              color='error'
              sx={{ fontSize: 13 }}
            />

            {allowStatusUpdate ? (
              <Button
                variant='tonal'
                size='small'
                color={UserStatusColor[userData.status]}
                onClick={openStatusModal}
              >
                {userData.status}
              </Button>
            ) : (
              <UserStatusTag status={userData.status} />
            )}

            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Icon icon='tabler:map-pin' fontSize={15} />
              {getCountry(userData.country)}
            </Typography>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Icon icon='tabler:calendar' fontSize={15} />{' '}
              Joined{' '}
              {dateToString(new Date(userData.createdAt))}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {actionBtns}
      </Box>
    </Card>
  )
}

export default UserInfoCardNew
