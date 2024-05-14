// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck //TODO: datepicker issue
import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'

import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  value: string[]
  onChange: (newVal: string[]) => void
  maxWidth?: number
}

const DateRangePicker = ({
  value,
  onChange,
  maxWidth,
}: Props) => {
  return (
    <Flatpickr
      value={value}
      options={{
        mode: 'range',
        disableMobile: true,
        dateFormat: 'Y-m-d',
        defaultDate: [],
      }}
      onChange={selectedDates => {
        onChange(selectedDates)
      }}
      render={({ ...props }, ref) => {
        return (
          <CustomTextField
            variant='standard'
            placeholder='10/1/2023 - 12/2/2023'
            {...props}
            value={value}
            ref={ref}
            sx={{ minWidth: 200, maxWidth }}
          />
        )
      }}
    />
  )
}

export default DateRangePicker
