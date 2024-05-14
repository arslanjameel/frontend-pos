import {
  Avatar,
  Box,
  SxProps,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { getInitials } from 'src/@core/utils/get-initials'

interface Props {
  img?: string
  name: string
  email?: string
  actionBtns?: React.ReactNode
  nameLink?: string
  onClick?: () => void
  sx?: SxProps
  textSx?: SxProps
}

const AppTableUserCard = ({
  img,
  name,
  email,
  actionBtns,
  nameLink,
  onClick,
  sx,
  textSx = {},
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 2,
        ...sx,
      }}
      onClick={onClick}
    >
      <Avatar src={img} alt={name}>
        {getInitials(name)}
      </Avatar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          spacing: 2,
        }}
      >
        {nameLink ? (
          <Typography
            color='primary'
            sx={{ fontWeight: 600, ...textSx }}
          >
            <Link href={nameLink}>{name}</Link>
          </Typography>
        ) : (
          <Typography
            color='primary'
            sx={{ fontWeight: 600, ...textSx }}
          >
            {name}
          </Typography>
        )}
        <Typography>{email}</Typography>
      </Box>

      <Box sx={{ ml: 'auto' }}>
        {actionBtns && actionBtns}
      </Box>
    </Box>
  )
}

export default AppTableUserCard
