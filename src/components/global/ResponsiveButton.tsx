import { Button, SxProps } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'

interface Props {
  label: string
  breakpoint?: number
  icon: string
  showStartIcon?: boolean
  sx?: SxProps
  variant?: 'contained' | 'outlined' | 'tonal' | 'text'
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void
  mini?: boolean
  size?: 'small' | 'medium' | 'large'
}

const ResponsiveButton = ({
  variant = 'contained',
  label,
  icon,
  showStartIcon = true,
  sx,
  onClick,
  mini,
  size,
}: Props) => {
  if (mini) {
    return (
      <Button
        size={size}
        variant={variant}
        sx={{ padding: '10px !important' }}
        onClick={onClick}
      >
        <Icon icon={icon} style={{ fontSize: 18 }} />
      </Button>
    )
  } else if (showStartIcon) {
    return (
      <Button
        size={size}
        variant={variant}
        startIcon={<Icon icon={icon} />}
        sx={{ minWidth: 'fit-content', ...sx }}
        onClick={onClick}
      >
        {label}
      </Button>
    )
  } else {
    return (
      <Button
        size={size}
        variant={variant}
        sx={{ minWidth: 'fit-content', ...sx }}
        onClick={onClick}
      >
        {label}
      </Button>
    )
  }
}

export default ResponsiveButton
