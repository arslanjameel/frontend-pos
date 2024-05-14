import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const DarkTimePicker = ({
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <Flatpickr
      disabled={disabled}
      value={value}
      onClose={(_, newTime) => onChange(newTime)}
      options={{
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: false,
      }}
      style={{
        padding: 8,
        border: '1px solid #a0a0a082',
        borderRadius: 5,
        fontSize: 16,
        color: '#7e7e7e',
        width: '90px',
      }}
      placeholder='--:--'
    />
  )
}

export default DarkTimePicker
