// ** React Imports
import { useState } from 'react'

// ** MUI Import
import { createFilterOptions } from '@mui/material/Autocomplete'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { Chip, MenuItem } from '@mui/material'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface IOption {
  label: string
  value: string
}
const addMissingItems = (
  oldList: IOption[],
  newList: IOption[],
) => {
  const tempOldList = oldList
  for (const newItem of newList) {
    if (
      !tempOldList.some(
        oldItem => oldItem.value === newItem.value,
      )
    ) {
      tempOldList.push(newItem)
    }
  }

  return tempOldList
}

const filter = createFilterOptions<IOption>()
interface Props {
  label?: string
  options: IOption[]
  value: string[]
  onChange: (newTags: string[]) => void
}
const TagsDropdown = ({
  label = 'Tags',
  options,
  value,
  onChange,
}: Props) => {
  const { primaryFilled, primaryLight } = UseBgColor()

  const [listOptions, setListOptions] = useState([
    ...options,
  ])

  return (
    <CustomAutocomplete
      fullWidth
      multiple
      value={listOptions.filter(opt =>
        value.includes(opt.value),
      )}
      filterSelectedOptions
      options={listOptions}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={label}
          fullWidth
        />
      )}
      getOptionLabel={option => option.label}
      onChange={(event, newValue) => {
        const newValues = newValue.map(nv => nv.value)

        const newOnes = addMissingItems(
          listOptions,
          newValue,
        )

        setListOptions(newOnes)
        onChange(newValues)
      }}
      filterOptions={(options: IOption[], params: any) => {
        // console.log(options, params)
        const { inputValue } = params
        const filtered = filter(options, params)
        const isExisting = options.some(
          (option: IOption) => inputValue === option.label,
        )
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            value: inputValue,
            label: inputValue,
          })
        }

        return filtered
      }}
      renderTags={(value: IOption[], getTagProps) =>
        value.map((option: IOption, index: number) => (
          <Chip
            color='primary'
            sx={{ py: 3 }}
            label={option.label}
            {...(getTagProps({ index }) as {})}
            key={index}
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
  )
}

export default TagsDropdown
