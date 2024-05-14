import { Box, Card, Typography } from '@mui/material'
import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import UseBgColor from 'src/@core/hooks/useBgColor'
import AppSelect from './AppSelect'

interface Props<T extends FieldValues> {
  name: Path<T>
  control?: Control<T, any>
  disabled?: boolean
  error?: any
  value?: any
  changeValues: (vals: any) => any
}

const PublishStatusCard = <T extends FieldValues>({
  value,
  error,
  changeValues,
}: Props<T>) => {
  const {
    successFilled,
    errorFilled,
    warningFilled,
    secondaryFilled,
  } = UseBgColor()

  const getStatusColor = (status: 0 | 1 | 2) => {
    switch (status) {
      case 0:
        return warningFilled
      case 1:
        return successFilled
      case 2:
        return errorFilled
      default:
        return secondaryFilled
    }
  }

  return (
    <Card
      sx={{
        p: 4,
        pb: 8,
        width: '100%',
        height: 'fit-content',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 6,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
          Status
        </Typography>
        <Box
          sx={{
            ...getStatusColor(value),
            width: 20,
            height: 20,
            borderRadius: 20,
          }}
        ></Box>
      </Box>

      <AppSelect
        placeholder='Published'
        label='Status'
        error={error}
        value={value}
        handleChange={e => changeValues(e.target.value)}
        options={[
          { label: 'Pending', value: 0 },
          { label: 'Published', value: 1 },
          { label: 'Discontinued', value: 2 },
        ]}
      />
    </Card>
  )
}

export default PublishStatusCard
