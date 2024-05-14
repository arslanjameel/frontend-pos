import { SxProps } from '@mui/material'
import React from 'react'

import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  id?: string
  name?: string
  label?: string
  disabled?: boolean
  error?: any
  placeholder?: string
  maxLength?: number
  minRows?: number
  readOnly?: boolean
  sx?: SxProps
  inputType?:
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'number'
    | 'time'
  multiline?: boolean
  value: any
  onChange: (val: string) => void
  onBlur?: () => void
}

const UncontrolledInput = ({
  id,
  name,
  disabled,
  readOnly,
  sx,
  inputType = 'text',
  multiline,
  minRows,
  label,
  value,
  maxLength,
  error,
  placeholder,
  onChange,
  onBlur,
}: Props) => {
  return (
    <CustomTextField
      id={id}
      name={name}
      InputProps={{ readOnly }}
      sx={sx}
      type={inputType}
      disabled={disabled}
      fullWidth
      multiline={multiline}
      minRows={minRows}
      label={label}
      value={value}
      onChange={e => {
        let sanitizedValue = e.target.value
        if (maxLength) {
          sanitizedValue = sanitizedValue.slice(
            0,
            maxLength,
          )
        }
        onChange(sanitizedValue)
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      error={Boolean(error)}
      {...(error && { helperText: error.message })}
    />
  )
}

export default UncontrolledInput
