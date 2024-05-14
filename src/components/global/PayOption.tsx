import { Box, Typography } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  icon: string
  title: string
  active?: boolean
  onClick?: () => void
}

const PayOption = ({
  icon,
  title,
  active,
  onClick,
}: Props) => {
  const { primaryLight, secondaryFilled } = UseBgColor()

  const _color = active ? primaryLight.color : 'initial'
  const _bgColor = active
    ? primaryLight.backgroundColor
    : 'transparent'
  const _border = active
    ? primaryLight.backgroundColor
    : secondaryFilled.backgroundColor

  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 3,
        borderRadius: 1,
        width: '100%',
        background: _bgColor,
        border: `1px solid ${_border}`,
        userSelect: 'none',
      }}
      onClick={onClick}
    >
      <Icon icon={icon} style={{ color: _color }} />
      <Typography sx={{ color: _color }}>
        {title}
      </Typography>
    </Box>
  )
}

export default PayOption
