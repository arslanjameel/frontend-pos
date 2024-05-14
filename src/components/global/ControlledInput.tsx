// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck //TODO:error caused by name field
import {
  IconButton,
  InputAdornment,
  SxProps,
  Typography,
} from '@mui/material'
import Cleave from 'cleave.js/react'
import React, { useState } from 'react'
import {
  Controller,
  Control,
  FieldValues,
  Path,
} from 'react-hook-form'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import capitalize from 'src/utils/capitalize'
import {
  IInputAllowOption,
  inputAllows,
} from 'src/utils/inputUtils'

interface Props<T extends FieldValues> {
  id?: string
  name?: Path<T>
  label: string
  placeholder?: string
  control: Control<T, any>
  disabled?: boolean
  error?: any
  inputType?:
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'number'
    | 'time'
    | 'pinCode'
  maxLength?: number
  sx?: SxProps
  multiline?: boolean
  readOnly?: boolean
  minRows?: number
  customChange?: (val: string) => void
  autoComplete?: string
  capitalizeValue?: boolean
  upperCaseValue?: boolean
  lowerCaseValue?: boolean
  inputAllowsOnly?: IInputAllowOption[]
  required?: boolean
}

const ControlledInput = <T extends FieldValues>({
  autoComplete,
  name,
  label,
  control,
  placeholder,
  disabled = false,
  error,
  inputType = 'text',
  maxLength,
  multiline = false,
  readOnly = false,
  minRows = 5,
  sx = {},
  customChange,
  capitalizeValue,
  upperCaseValue,
  lowerCaseValue,
  inputAllowsOnly,
  required,
}: Props<T>) => {
  const { errorFilled } = UseBgColor()
  const [showPassword, setShowPassword] = useState(false)

  const getClassName = () => {
    let _className = ''
    if (error) _className += ' error'
    if (disabled) _className += ' disabled'

    return _className
  }

  if (inputType === 'password' || inputType === 'pinCode') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({
          field: { value, onChange, onBlur },
        }) => (
          <CustomTextField
            required={required}
            sx={sx}
            fullWidth
            value={value}
            disabled={disabled}
            onBlur={onBlur}
            label={label}
            onChange={event => {
              let sanitizedValue = event.target.value
              if (inputType === 'pinCode') {
                sanitizedValue = event.target.value.replace(
                  /\D/g,
                  '',
                )
              }
              if (maxLength) {
                sanitizedValue = sanitizedValue.slice(
                  0,
                  maxLength,
                )
              }
              onChange(sanitizedValue)
            }}
            autoComplete={autoComplete}
            id={name}
            placeholder={
              placeholder + (required ? ' *' : '')
            }
            error={Boolean(error)}
            {...(error && { helperText: error.message })}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onMouseDown={e => e.preventDefault()}
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    <Icon
                      fontSize='1.25rem'
                      icon={
                        showPassword
                          ? 'tabler:eye'
                          : 'tabler:eye-off'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    )
  } else if (inputType === 'tel') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({
          field: { value, onChange, onBlur },
        }) => (
          <>
            <Typography
              sx={{ fontSize: 13, mb: 0.2, mt: -0.2 }}
            >
              {label}
              {required ? '*' : ''}
            </Typography>
            <CleaveWrapper>
              <Cleave
                disabled={disabled}
                className={getClassName()}
                value={value}
                placeholder={
                  placeholder + (required ? ' *' : '')
                }
                options={{
                  blocks: [4, 3, 4],
                  delimiter: ' ',
                  numericOnly: true,
                }}
                onChange={e => onChange(e.target.rawValue)}
                onBlur={onBlur}
                readOnly={readOnly}
              />
            </CleaveWrapper>
            {error && (
              <Typography
                sx={{
                  fontSize: 13,
                  color: errorFilled.backgroundColor,
                  margin: '0.25rem 0rem 0rem',
                }}
              >
                {error.message}
              </Typography>
            )}
          </>
        )}
      />
    )
  } else {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required: true, maxLength }}
        render={({
          field: { value, onChange, onBlur },
        }) => (
          <CustomTextField
            required={required}
            autoComplete={autoComplete}
            InputProps={{ readOnly }}
            sx={sx}
            type={inputType}
            disabled={disabled}
            fullWidth
            multiline={multiline}
            minRows={minRows}
            label={label}
            value={value}
            onBlur={onBlur}
            onChange={event => {
              let sanitizedValue = event.target.value //.replace(/\D/g, '')
              if (inputAllowsOnly) {
                sanitizedValue = inputAllows(
                  sanitizedValue,
                  inputAllowsOnly,
                )
              }

              if (upperCaseValue) {
                sanitizedValue =
                  sanitizedValue.toUpperCase()
              }
              if (lowerCaseValue) {
                sanitizedValue =
                  sanitizedValue.toLowerCase()
              }

              if (capitalizeValue && !multiline) {
                sanitizedValue = capitalize(sanitizedValue)
              }

              if (maxLength) {
                if (sanitizedValue.length <= maxLength) {
                  onChange(sanitizedValue)
                  customChange &&
                    customChange(sanitizedValue)
                }
              } else {
                onChange(sanitizedValue)
                customChange && customChange(sanitizedValue)
              }
            }}
            placeholder={
              placeholder + (required ? ' *' : '')
            }
            error={Boolean(error)}
            {...(error && { helperText: error.message })}
          />
        )}
      />
    )
  }
}

export default ControlledInput
