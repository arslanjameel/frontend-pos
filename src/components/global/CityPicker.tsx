import React from 'react'

import AppSelect from './AppSelect'
import { useGetCitiesQuery } from 'src/store/apis/accountSlice'

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

const CityPicker = ({
  value,
  handleChange,
  id,
  label = 'City',
  placeholder = 'Leceister',
  error,
  disabled,
  readOnly,
}: Props) => {
  const { data: cities } = useGetCitiesQuery()

  return (
    <AppSelect
      id={id}
      label={label}
      error={error}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      options={
        cities && cities
          ? cities.map((c: any) => ({
              ...c,
              label: c.name,
              value: c.id,
            }))
          : []
      }
      value={String(value) === '0' ? '' : value}
      handleChange={e => handleChange(e.target.value)}
    />
  )
}

export default CityPicker
