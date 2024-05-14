import {
  MenuItem,
  SelectChangeEvent,
  SxProps,
} from '@mui/material'
import React from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  id?: string
  label?: string
  placeholder?: string
  error?: string
  value: string | number
  handleChange: (event: SelectChangeEvent<any>) => void
  options: { label: string; value: any }[] | undefined
  disabled?: boolean
  readOnly?: boolean
  maxWidth?: number
  sx?: SxProps
  required?: boolean
}

const AppSelect = ({
  id,
  label = '',
  placeholder = 'Select',
  error,
  value,
  handleChange,
  options = [],
  disabled,
  readOnly,
  sx,
  required,
}: Props) => {
  return (
    <CustomTextField
      placeholder={placeholder}
      select
      fullWidth
      required={required}
      defaultValue={value}
      label={label}
      id={id || 'select-options'}
      SelectProps={{
        value,
        defaultValue: value,
        onChange: e => handleChange(e),
        readOnly,
        placeholder,
      }}
      error={Boolean(error)}
      helperText={error}
      disabled={disabled}
      sx={{ width: '100%', overflow: 'hidden', ...sx }}
    >
      {options.length === 0 && (
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
      )}
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </CustomTextField>
  )
}

export default AppSelect
