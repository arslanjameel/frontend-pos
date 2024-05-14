import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import ControlledInput from '../global/ControlledInput'
import { Card, Typography } from '@mui/material'

interface Props<T extends FieldValues> {
  priceA: Path<T>
  priceB: Path<T>
  priceC: Path<T>
  control: Control<T, any>
  disabled?: boolean
  errors?: any
}

const PricesCard = <T extends FieldValues>({
  priceA,
  priceB,
  priceC,
  control,
  disabled,
  errors,
}: Props<T>) => {
  return (
    <Card
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 17 }}
        id='pricing'
      >
        Pricing
      </Typography>
      <ControlledInput
        required
        name={priceA}
        control={control}
        label='Price A (Needs Manager Approval)'
        error={errors.priceA}
        placeholder='230.00'
        inputType='number'
        disabled={disabled}
      />
      <ControlledInput
        required
        name={priceB}
        control={control}
        label='Price B (Discounted)'
        error={errors.priceB}
        placeholder='230.00'
        inputType='number'
        disabled={disabled}
      />
      <ControlledInput
        required
        name={priceC}
        control={control}
        label='Price C (Normal)'
        error={errors.priceC}
        placeholder='230.00'
        inputType='number'
        disabled={disabled}
      />
    </Card>
  )
}

export default PricesCard
