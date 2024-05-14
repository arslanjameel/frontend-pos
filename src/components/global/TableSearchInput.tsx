import { SxProps } from '@mui/material'
import React from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  sx?: SxProps
}

const TableSearchInput = ({
  placeholder = 'Search',
  value,
  onChange,
  sx,
}: Props) => {
  return (
    <CustomTextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ width: '100%', ...sx }}
    />
  )
}

export default TableSearchInput
