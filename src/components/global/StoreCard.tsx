import { Card, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  title: string
}

const StoreCard = ({ title }: Props) => {
  const { primaryLight } = UseBgColor()

  return (
    <Card
      sx={{
        height: 100,
        maxWidth: 150,
        width: '100%',
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: primaryLight.color,
        backgroundColor: primaryLight.backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        px: 3,
      }}
    >
      <Image
        src='/images/store.png'
        alt='purple-store'
        width={36}
        height={36}
      />
      <Typography fontWeight={600} textAlign='center'>
        {title}
      </Typography>
    </Card>
  )
}

export default StoreCard
