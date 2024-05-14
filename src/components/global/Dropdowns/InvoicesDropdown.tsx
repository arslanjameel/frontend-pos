// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Box, MenuItem, Typography } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { formatCurrency } from 'src/utils/formatCurrency'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { useState } from 'react'
import { getFullName } from 'src/utils/dataUtils'
import { dateToString } from 'src/utils/dateUtils'

interface Props {
  label?: string
  value: number
  onSelect?: (id: number, invoice: ISaleInvoice) => void
  options: ISaleInvoice[]
  search?: string
  onSearch?: (value: string) => void
}

const InvoicesDropdown = ({
  label,
  value,
  onSelect,
  options,
  onSearch,
}: Props) => {
  const [open, setOpen] = useState(false)
  const { primaryFilled, primaryLight } = UseBgColor()

  // filterOptions={(options, { inputValue }) => {
  //   onSearch && onSearch(inputValue)

  //   return options.filter(option =>
  //     (option?.searchable || '')
  //       .toLowerCase()
  //       .includes(inputValue.toLowerCase()),
  //   )
  // }}

  return (
    <CustomAutocomplete
      freeSolo
      open={open}
      value={value}
      disableClearable
      isOptionEqualToValue={(option, value) =>
        option.id === value
      }
      fullWidth
      options={options.map(option => ({
        ...option,
        label: option.invoice_number,
        value: option.id,
        searchable:
          option.invoice_number +
          ' ' +
          getFullName(option.customer),
      }))}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={label}
          fullWidth
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={e => onSearch(e.target.value)}
        />
      )}
      getOptionLabel={option => option.searchable || ''}
      renderOption={(props, option, state) => (
        <MenuItem
          key={option.id}
          value={option.id}
          onClick={() => {
            onSelect && onSelect(option.id, option)

            setOpen(false)
          }}
          sx={{
            background: `${
              state.selected
                ? primaryFilled.backgroundColor
                : '#fff'
            }  !important`,
            '&:hover': {
              background: `${
                state.selected
                  ? primaryFilled.backgroundColor
                  : primaryLight.backgroundColor
              } !important`,
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: state.selected
                    ? primaryFilled.color
                    : 'initial',
                }}
              >
                {dateToString(new Date(option.created_at))}
              </Typography>
              <span>-</span>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: state.selected
                    ? primaryFilled.color
                    : 'initial',
                }}
              >
                {option.invoice_number}
              </Typography>
              <span>-</span>
              <Typography
                sx={{
                  color: state.selected
                    ? primaryFilled.color
                    : 'initial',
                }}
              >
                {getFullName(option.customer)}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: state.selected
                  ? primaryFilled.color
                  : 'initial',
              }}
            >
              {formatCurrency(option.total)}
            </Typography>
          </Box>
        </MenuItem>
      )}
    />
  )
}

export default InvoicesDropdown
