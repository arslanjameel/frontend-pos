import { Box, MenuItem, Typography } from '@mui/material'
import React from 'react'

import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { IUserWithID } from 'src/models/IUser'
import {
  generateID,
  getFullName,
} from 'src/utils/dataUtils'

interface Props {
  options: IUserWithID[]
  searchInputRef?: any
  label?: string

  // value?: any[]
  onSelect?: (id: number) => void

  search?: string
  onSearch: (value: string) => void
}

const UsersDropdown = ({
  options,
  searchInputRef,
  label,
  search,
  onSearch,
  onSelect,
}: Props) => {
  return (
    <Box>
      <CustomAutocomplete
        fullWidth
        options={
          options.length === 0
            ? []
            : options.map(option => ({
                ...option,
                searchable:
                  option.first_name +
                  ',' +
                  option.last_name,
              }))
        }
        renderInput={params => (
          <CustomTextField
            {...params}
            ref={searchInputRef}
            label={label}
            value={search}
            fullWidth
            InputProps={{
              ...params.InputProps,
            }}
            onChange={e => onSearch(e.target.value)}
          />
        )}
        getOptionLabel={option => option.searchable}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderOption={(props, option, state) => (
          <Box key={generateID() + 1}>
            {option.id && (
              <MenuItem
                key={option.id}
                value={option.id}
                onClick={() =>
                  onSelect && onSelect(option.id)
                }
              >
                <Box>
                  <Typography>
                    {getFullName(option)}
                  </Typography>
                </Box>
              </MenuItem>
            )}
          </Box>
        )}
      />
    </Box>
  )
}

export default UsersDropdown
