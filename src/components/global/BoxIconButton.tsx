import { Box, IconButton } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  icon: string
  onClick: () => void
  disabled?: boolean
}

const BoxIconButton = ({
  icon,
  onClick,
  disabled,
}: Props) => {
  const { primaryFilled } = UseBgColor()

  return (
    <Box>
      <IconButton
        disabled={disabled}
        color='primary'
        sx={{
          borderRadius: '7px !important',
          ...primaryFilled,
          '&:hover': { ...primaryFilled },
        }}
        onClick={onClick}
      >
        <Icon icon={icon} />
      </IconButton>
    </Box>
  )
}

export default BoxIconButton
