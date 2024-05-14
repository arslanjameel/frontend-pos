// ** MUI Imports
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}

interface Props {
  id?: string
  label?: string
  placeholder?: string
  error?: string
  value: any[]
  handleChange: (event: SelectChangeEvent<any>) => void
  options: { label: string; value: any }[]
  disabled?: boolean
  readOnly?: boolean
  hasChip?: boolean
  required?: boolean
}

const AppSelectMultiple = ({
  id,
  label,
  placeholder,
  error,
  value,
  handleChange,
  options,
  disabled,
  readOnly,
  hasChip = false,
  required,
}: Props) => {
  return (
    <Box>
      <CustomTextField
        select
        fullWidth
        defaultValue=''
        required={required}
        label={label}
        id={id || 'select-multiple'}
        SelectProps={{
          MenuProps,
          multiple: true,
          value,
          onChange: e => handleChange(e),
          readOnly,
          placeholder,
          renderValue: hasChip
            ? selected => (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {(selected as unknown as string[]).map(
                    value => (
                      <CustomChip
                        key={value}
                        label={
                          options.find(
                            opt => opt.value === value,
                          )?.label
                        }
                        sx={{ py: 4 }}
                        skin='light'
                        color='primary'
                      />
                    ),
                  )}
                </Box>
              )
            : undefined,
        }}
        error={Boolean(error)}
        helperText={error}
        disabled={disabled}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </Box>
  )
}

export default AppSelectMultiple
