import { Box, Button, Typography } from '@mui/material'
import React from 'react'

import { useWindowSize } from 'src/hooks/useWindowSize'
import Icon from 'src/@core/components/icon'
import ImageWithUpload from './ImageWithUpload'

interface Props {
  primaryBtnText: string

  selectedImage: string | null
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  resetImage?: () => void
}

const UserInfoCardLegacy = ({
  selectedImage,
  handleImageChange,
  resetImage,
  primaryBtnText = 'Upload store logo',
}: Props) => {
  const { isMobileSize } = useWindowSize()

  return (
    <Box
      sx={{
        gap: 4,
        display: 'flex',
        flexDirection: isMobileSize ? 'column' : 'row',
        alignItems: 'center',
      }}
    >
      <ImageWithUpload
        selectedImage={selectedImage}
        handleImageChange={handleImageChange}
        resetImage={resetImage}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          width: 'fit-content',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: isMobileSize
              ? 'center'
              : 'flex-start',
          }}
        >
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='upload-image-1'
            type='file'
            onChange={handleImageChange}
          />

          {!isMobileSize && (
            <label htmlFor='upload-image-1'>
              <Button
                variant='contained'
                color='primary'
                title={primaryBtnText}
                component='span'
              >
                {isMobileSize ? (
                  <Icon icon='tabler:cloud-upload' />
                ) : (
                  primaryBtnText
                )}
              </Button>
            </label>
          )}
          {!isMobileSize && (
            <Button
              variant='tonal'
              color='secondary'
              title='Reset'
              onClick={resetImage}
            >
              Reset
            </Button>
          )}
        </Box>

        <Typography
          sx={{
            textAlign: isMobileSize ? 'center' : 'left',
          }}
        >
          Allowed JPG, GIF or PNG. Max size of 800k
        </Typography>
      </Box>
    </Box>
  )
}

export default UserInfoCardLegacy
