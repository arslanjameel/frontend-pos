import { Box, Menu } from '@mui/material'
import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  label: string
  values: any[]
  error?: string
  onChange: (values: [string, string]) => void
  readOnly?: boolean
}

const DualTimePicker = ({
  label,
  values,
  error,
  onChange,
  readOnly,
}: Props) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const openOptions = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (!readOnly) setAnchorEl(event.currentTarget)
  }
  const closeOptions = () => setAnchorEl(null)

  return (
    <>
      <Menu
        id='long-menu'
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeOptions}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: 'fit-content',
            padding: 3,
            paddingRight: 6,
            paddingLeft: 6,
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomTextField
            label=''
            type='time'
            value={values[0]}
            onChange={e =>
              onChange([e.target.value, values[1]])
            }
          />
          <CustomTextField
            label=''
            type='time'
            value={values[1]}
            onChange={e =>
              onChange([values[0], e.target.value])
            }
          />
        </Box>
      </Menu>

      <Box
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={openOptions}
      >
        <CustomTextField
          fullWidth
          InputProps={{ readOnly: true }}
          label={label}
          error={Boolean(error)}
          {...(error && { helperText: error })}
          value={`${values[0] || ''} - ${values[1] || ''}`}
        />
      </Box>
    </>
  )
}

export default DualTimePicker
