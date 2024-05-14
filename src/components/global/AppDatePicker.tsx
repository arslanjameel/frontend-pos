// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker, {
  ReactDatePickerProps,
} from 'react-datepicker'

// ** Types
// import { Date } from 'src/types/forms/reactDatepickerTypes'

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

const AppRangeDatePicker = ({
  popperPlacement,
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const [startDate, setStartDate] = useState<Date>(
    new Date(),
  )
  const [endDate, setEndDate] = useState<Date>(
    addDays(new Date(), 15),
  )

  // const [startDateRange, setStartDateRange] = useState<Date>(new Date())
  // const [endDateRange, setEndDateRange] = useState<Date>(addDays(new Date(), 45))

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  // const handleOnChangeRange = (dates: any) => {
  //   const [start, end] = dates
  //   setStartDateRange(start)
  //   setEndDateRange(end)
  // }

  const CustomInput = forwardRef(
    ({ end, start, label, ...props }: PickerProps, ref) => {
      const startDate = format(start, 'MM/dd/yyyy')
      const endDate =
        end !== null ? -format(end, 'MM/dd/yyyy') : null

      const value = `${startDate}${
        endDate !== null ? endDate : ''
      }`

      return (
        <CustomTextField
          inputRef={ref}
          label={label || ''}
          {...props}
          value={value}
        />
      )
    },
  )

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <DatePicker
        selectsRange
        endDate={endDate}
        selected={startDate}
        startDate={startDate}
        id='date-range-picker'
        onChange={handleOnChange}
        shouldCloseOnSelect={false}
        popperPlacement={popperPlacement}
        customInput={
          <CustomInput
            label='Date Range'
            start={startDate as Date | number}
            end={endDate as Date | number}
          />
        }
      />
    </Box>
  )
}

export default AppRangeDatePicker
