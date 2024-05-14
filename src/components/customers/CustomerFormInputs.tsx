import { Grid } from '@mui/material'
import React from 'react'

import ControlledInput from '../global/ControlledInput'
import AppSelect from '../global/AppSelect'
import { priceBands } from 'src/models/ICustomer'
import {
  PLACEHOLDER_CREDIT_LIMIT,
  PLACEHOLDER_PHONE_NUMBER,
} from 'src/utils/constants/formPlaceholders'

interface Props {
  control: any
  errors?: any
  setValue?: any
  trigger?: any
  watch?: any
}

const CustomerFormInputs = ({
  control,
  errors,
  setValue,
  trigger,
  watch,
}: Props) => {
  return (
    <Grid container columns={12} spacing={4} sx={{ p: 6 }}>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='accountName'
          control={control}
          label='Account Name'
          error={errors.accountName}
          placeholder='John'
          capitalizeValue
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          inputType='email'
          name='email'
          control={control}
          label='Email'
          error={errors.email}
          placeholder='john.doe@gmail.com'
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='firstName'
          control={control}
          label='First Name'
          error={errors.firstName}
          placeholder='John'
          capitalizeValue
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='lastName'
          control={control}
          label='Last Name'
          error={errors.lastName}
          placeholder='Doe'
          capitalizeValue
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='primaryPhone'
          control={control}
          label='Primary Phone'
          error={errors.primaryPhone}
          placeholder={PLACEHOLDER_PHONE_NUMBER}
          inputType='tel'
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='secondPhone'
          control={control}
          label='Secondary Phone'
          error={errors.secondPhone}
          placeholder={PLACEHOLDER_PHONE_NUMBER}
          inputType='tel'
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <AppSelect
          label='Price Band'
          placeholder='Price Band'
          value={watch('priceBand')}
          handleChange={e => {
            setValue('priceBand', e.target.value)
            trigger('priceBand')
          }}
          options={priceBands}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='creditLimit'
          control={control}
          label='Credit Limit'
          error={errors.creditLimit}
          placeholder={PLACEHOLDER_CREDIT_LIMIT}
          inputType='number'
        />
      </Grid>
    </Grid>
  )
}

export default CustomerFormInputs
