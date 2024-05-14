import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  img: string | null
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

const ThumbnailCard = ({ img = null, onChange }: Props) => {
  const { primaryFilled } = UseBgColor()

  return (
    <Card
      sx={{
        p: 4,
        px: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 4,
        height: 350,
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        Thumbnail
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Image
          src={img || '/images/avatars/person1.png'}
          alt='person'
          fill
          objectFit='contain'
        />

        <input
          accept='image/*'
          style={{ display: 'none' }}
          id='upload-store-logo1'
          type='file'
          onChange={onChange}
        />
        <label htmlFor='upload-store-logo1'>
          <IconButton
            component='span'
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              transform: 'translate(40%, -20%)',
              ...primaryFilled,
              '&:hover': { ...primaryFilled },
            }}
            size='small'
            color='primary'
          >
            <Icon icon='tabler:edit' />
          </IconButton>
        </label>
      </Box>

      <Typography sx={{ textAlign: 'center' }}>
        Set the product thumbnail image. Only *.png, *.jpg
        image files are accepted
      </Typography>
    </Card>
  )
}

export default ThumbnailCard
