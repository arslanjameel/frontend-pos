import { Box, ChipProps } from '@mui/material'
import React from 'react'

import UseBgColor from 'src/@core/hooks/useBgColor'
import Icon from 'src/@core/components/icon'

const CustomTag = (props: ChipProps) => {
  const {
    label,
    color = 'primary',
    onDelete,
    sx,
    ...others
  } = props
  const {
    primaryLight,
    errorLight,
    successLight,
    warningLight,
    secondaryLight,
  } = UseBgColor()

  const getColor = () => {
    if (color === 'error') {
      return errorLight
    } else if (color === 'success') {
      return successLight
    } else if (color === 'warning') {
      return warningLight
    } else if (color === 'secondary') {
      return secondaryLight
    } else {
      return primaryLight
    }
  }

  return (
    <Box
      {...others}
      sx={{
        py: 1,
        px: 2,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: 'fit-content',
        height: 'fit-content',
        zIndex: 999,
        whiteSpace: 'nowrap',

        ...sx,
        ...getColor(),
      }}
    >
      {label}
      {onDelete && (
        <Icon
          icon='tabler:x'
          style={{ fontSize: 15, cursor: 'pointer' }}
        />
      )}
    </Box>
  )
}

export default CustomTag
