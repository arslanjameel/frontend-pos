import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { getInitials } from 'src/@core/utils/get-initials'

interface Props {
  img: string
  from?: string
  text: string
  time: string
}

const ChatCard = ({
  img,
  from = 'Unknown User',
  text,
  time,
}: Props) => {
  return (
    <Box
      sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
    >
      <Box>
        <Avatar src={img} alt={from}>
          {getInitials(from)}
        </Avatar>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography>{text}</Typography>
        <Typography
          variant='subtitle2'
          sx={{ mt: 1, opacity: 0.7 }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  )
}

export default ChatCard
