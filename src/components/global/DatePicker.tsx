// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import format from 'date-fns/format'

import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  label?: string
  placeholder?: string
  value: string
  onChange: (newDate: string) => void
  maxWidth?: number
}

const DatePicker = ({
  label = '',
  placeholder = '',
  value,
  onChange,
  maxWidth,
}: Props) => {
  return (
    <Flatpickr
      value={value}
      options={{ disableMobile: true, dateFormat: 'd M Y' }}
      onChange={dates =>
        onChange(format(dates[0], 'dd-MM-Y'))
      }
      render={({ ...props }, ref) => {
        return (
          <CustomTextField
            fullWidth
            variant='standard'
            label={label}
            placeholder={placeholder}
            {...props}
            value={value}
            ref={ref}
            sx={{ maxWidth }}
          />
        )
      }}
    />
  )
}

export default DatePicker
