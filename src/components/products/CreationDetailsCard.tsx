import { Card, Typography } from '@mui/material'
import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

interface Props<T extends FieldValues> {
  createdBy: Path<T>
  publishedBy: Path<T>
  control: Control<T, any>
  disabled?: boolean
  errors?: any
}

const CreationDetailsCard = <T extends FieldValues>({
  createdBy,
  publishedBy,
  errors,
}: Props<T>) => {
  return (
    <Card
      sx={{
        p: 4,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        height: 'fit-content',
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
        Creation Details
      </Typography>

      <CustomTextField
        label='Created By'
        error={errors.createdBy}
        placeholder='Name'
        value={createdBy}
        disabled
        fullWidth
      />

      <CustomTextField
        label='Published By'
        error={errors.publishedBy}
        placeholder='Name'
        value={publishedBy}
        disabled
        fullWidth
      />
    </Card>
  )
}

export default CreationDetailsCard
