import React from 'react'

import AppSelect from './AppSelect'
import { useGetCountriesQuery } from 'src/store/apis/accountSlice'

interface Props {
  value: number | string
  handleChange: (val: any) => void

  id?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
}

const CountryPicker = ({
  value,
  handleChange,
  id,
  label = 'Country',
  placeholder = 'England',
  error,
  disabled,
  readOnly,
}: Props) => {
  const { data: countries } = useGetCountriesQuery()

  return (
    <AppSelect
      id={id}
      label={label}
      error={error}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      options={
        countries && countries
          ? countries.map((c: any) => ({
              ...c,
              label: c.name,
              value: c.id,
            }))
          : []
      }
      value={value}
      handleChange={e => handleChange(e.target.value)}
    />
  )
}

export default CountryPicker
