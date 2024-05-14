import {
  Autocomplete,
  MenuItem,
  createFilterOptions,
} from '@mui/material'
import React, { useState } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import CustomTextField from 'src/@core/components/mui/text-field'
import CustomTag from './CustomTag'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface ISelectOption {
  label: string
  value: any
}

interface Props<T extends FieldValues> {
  value?: any
  name: Path<T>
  label: string
  placeholder?: string
  control?: Control<T, any>
  disabled?: boolean
  multiple?: boolean
  suggest?: boolean
  error?: any
  selectOptions: ISelectOption[]
  changeValues?: (values: any[] | any | null) => void
  onBlur?: () => void
}

const ControlledAutocomplete = <T extends FieldValues>({
  value,

  // name,
  label,
  placeholder,

  // control,
  disabled,
  multiple = true,
  suggest = true,
  error,
  selectOptions,
  changeValues,
  onBlur,
}: Props<T>) => {
  const { primaryFilled, primaryLight } = UseBgColor()
  const [listOptions] = useState([...selectOptions])
  const filter = createFilterOptions<ISelectOption>()

  return (
    <Autocomplete
      disableClearable
      defaultValue={
        multiple
          ? listOptions.filter(opt => opt.value === value)
          : listOptions.find(opt => opt.value === value)
      }
      value={
        multiple
          ? listOptions.filter(opt => opt.value === value)
          : listOptions.find(opt => opt.value === value)
      }
      multiple={multiple}
      options={listOptions}
      disabled={disabled}
      filterOptions={(options, params) => {
        //@ts-ignore
        const filtered = filter(options, params)

        const { inputValue } = params

        if (suggest) {
          //@ts-ignore
          const isExisting = options.some(
            option => inputValue === option.label,
          )
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              value: inputValue,
              label: inputValue,
            })

            // setListOptions([...listOptions, newSection])
          }
        }

        return filtered
      }}
      selectOnFocus
      clearOnBlur
      onBlur={onBlur && onBlur}
      handleHomeEndKeys
      getOptionLabel={(option: ISelectOption) =>
        option.label
      }
      onChange={(_e, newValue: any[] | any | null) => {
        onBlur && onBlur()
        if (newValue) {
          // if (multiple && Array.isArray(newValue)) {
          const newValues = newValue.map(
            (v: { value: any }) => v.value,
          )

          changeValues && changeValues(newValues)

          // } else {
          //   if (newValue) {
          //     if ('value' in newValue) {
          //       changeValues && changeValues(newValue.value)
          //     }
          //   } else {
          //     changeValues && changeValues(newValue)
          //   }
          // }
        } else {
          changeValues && changeValues(newValue)
        }
      }}
      renderInput={params => (
        <CustomTextField
          {...params}
          disabled={disabled}
          label={label}
          onBlur={onBlur}
          placeholder={placeholder}
          error={Boolean(error)}
          {...(error && { helperText: error.message })}
        />
      )}
      renderTags={(tags: ISelectOption[], getTagProps) =>
        tags.map((t: ISelectOption, index) => (
          <CustomTag
            label={t.label}
            {...getTagProps({ index })}
            key={t.value}
          />
        ))
      }
      renderOption={(props, option, state) => (
        <MenuItem
          {...props}
          sx={{
            py: '8px !important',
            backgroundColor: `${
              state.selected
                ? primaryFilled.backgroundColor
                : 'initial'
            } !important`,
            color: state.selected
              ? primaryFilled.color
              : 'initial',
            '&:hover': {
              backgroundColor: `${primaryLight.backgroundColor} !important`,
              color: state.selected
                ? primaryLight.color
                : 'initial',
            },
          }}
        >
          {option.label}
        </MenuItem>
      )}
    />

    //   )}
    // />
  )
}

export default ControlledAutocomplete
