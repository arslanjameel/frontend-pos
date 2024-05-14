import { Box, IconButton } from '@mui/material'
import React from 'react'

// import Image from 'next/image'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  legacy?: boolean
  selectedImage: string | null
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  resetImage?: () => void
}

const ImageWithUpload = ({
  legacy,
  selectedImage,
  handleImageChange,
  resetImage,
}: Props) => {
  const {
    primaryFilled,
    primaryLight,
    secondaryFilled,
    secondaryLight,
  } = UseBgColor()
  const { isMobileSize } = useWindowSize()

  return (
    <Box
      sx={{ width: 100, height: 100, position: 'relative' }}
    >
      {/* <Image
        src={selectedImage || '/images/avatars/person1.png'}
        alt='person'
        height={100}
        width={100}
      /> */}

      <input
        accept='image/*'
        style={{ display: 'none' }}
        id='upload-image'
        type='file'
        onChange={handleImageChange}
      />

      {(!legacy || isMobileSize) && (
        <label htmlFor='upload-image'>
          <IconButton
            component='span'
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              transform: 'translate(40%, 20%)',
              ...primaryFilled,
              '&:hover': { ...primaryLight },
            }}
            size='small'
            color='primary'
          >
            <Icon icon='tabler:cloud-upload' />
          </IconButton>
        </label>
      )}
      {isMobileSize && selectedImage && (
        <IconButton
          component='span'
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            transform: 'translate(-40%, 20%)',
            ...secondaryFilled,
            '&:hover': { ...secondaryLight },
          }}
          size='small'
          color='error'
          onClick={resetImage}
        >
          <Icon icon='tabler:refresh' />
        </IconButton>
      )}
    </Box>
  )
}

export default ImageWithUpload
