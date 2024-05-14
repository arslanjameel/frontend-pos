import React from 'react'
import { Box, Typography } from '@mui/material'
import Cleave from 'cleave.js/react'
import { CleaveOptions } from 'cleave.js/options'

import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import UseBgColor from 'src/@core/hooks/useBgColor'

type MaskOptions = 'sortCode' | 'phone'

interface Props {
  label?: string
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
  onBlur?: () => void
  format: MaskOptions
  error?: string
  disabled?: boolean
  readOnly?: boolean
}

const MaskedInput = ({
  label = '',
  value,
  onChange,
  onBlur,
  format,
  error,
  placeholder = 'Type here... ',
  disabled,
  readOnly,
}: Props) => {
  const { errorFilled } = UseBgColor()
  const getOptions = (type: MaskOptions): CleaveOptions => {
    if (type === 'sortCode') {
      return {
        blocks: [2, 2, 2],
        delimiter: '-',
        numericOnly: true,
      }
    } else if (type === 'phone') {
      return {
        blocks: [4, 3, 4],
        delimiter: ' ',
        numericOnly: true,
      }
    }

    return {}
  }

  const getClassName = () => {
    let _className = ''
    if (error) _className += ' error'
    if (disabled) _className += ' disabled'

    return _className
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 13, mb: 0.2, mt: -0.2 }}>
        {label}
      </Typography>
      <CleaveWrapper>
        <Cleave
          disabled={disabled}
          className={getClassName()}
          value={value}
          placeholder={placeholder}
          options={getOptions(format)}
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
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default MaskedInput
