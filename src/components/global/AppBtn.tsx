import React from 'react'
import { Button } from '@mui/material'

import Icon from 'src/@core/components/icon'

const AppBtn = ({
  icon,
  text,
  color = 'primary',
  onClick,
  disabled,
}: {
  icon: string
  text: string
  color?: 'secondary' | 'primary'
  onClick?: () => void
  disabled?: boolean
}) => (
  <Button
    variant={color === 'primary' ? 'contained' : 'tonal'}
    sx={{ width: '100%', display: 'flex', gap: 2 }}
    color={color}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon icon={icon} />
    {text}
  </Button>
)

export default AppBtn
