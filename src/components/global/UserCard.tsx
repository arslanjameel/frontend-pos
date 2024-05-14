import {
  Avatar,
  Box,
  Card,
  Typography,
} from '@mui/material'
import React from 'react'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { getInitials } from 'src/@core/utils/get-initials'

interface Props {
  img?: string
  name: string
  line2?: string
  onClick?: () => void
  active?: boolean
}

const UserCard = ({
  img,
  name,
  line2,
  onClick,
  active,
}: Props) => {
  const { primaryFilled } = UseBgColor()
  const getColor = () => {
    return active
      ? {
          color: primaryFilled.color,
          bg: primaryFilled.backgroundColor,
        }
      : { color: 'inherit', bg: '#fff' }
  }

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 1,
        p: 2,
        gap: 2,
        cursor: 'pointer',
        background: getColor().bg,
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
          gap: 1,
        }}
      >
        <Typography
          variant='h6'
          sx={{ color: getColor().color }}
        >
          {name}
        </Typography>
        <Typography
          variant='body1'
          sx={{ color: getColor().color }}
        >
          {line2}
        </Typography>
      </Box>
    </Card>
  )
}

export default UserCard
