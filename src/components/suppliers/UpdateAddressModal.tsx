import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import ControlledInput from '../global/ControlledInput'
import CountryPicker from '../global/CountryPicker'
import AppModal from '../global/AppModal'
import CityPicker from '../global/CityPicker'

interface IDefaults {
  address: string
  post_code: string
  city: number | null
  country: number | null
}

const _defaults: IDefaults = {
  address: '',
  post_code: '',
  city: null,
  country: null,
}

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: IDefaults
  onSubmit: (address: IDefaults) => void
}

const UpdateAddressModal = ({
  open,
  handleClose,
  defaultValues = _defaults,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
    address: yup.string().nullable().optional(),
    addressLine2: yup.string().nullable().optional(),
    post_code: yup.string().nullable().optional(),
    city: yup.string().nullable().optional(),
    country: yup.string().nullable().optional(),
  })

  const {
    watch,
    setValue,
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { addressLine2: '', ...defaultValues },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={500}
      sx={{ p: 6 }}
    >
      <Typography
        variant='h4'
        fontWeight={600}
        marginBottom={5}
        textAlign='center'
      >
        Edit Address
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          columns={6}
          sm={12}
          xs={12}
          spacing={4}
        >
          <Grid item md={6} sm={6} xs={6}>
            <ControlledInput
              name='address'
              control={control}
              label='Address Line 1'
              error={errors.address}
              placeholder='12 Street Carlifonia'
            />
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <ControlledInput
              name='addressLine2'
              control={control}
              label='Address Line 2'
              error={errors.addressLine2}
              placeholder='12 Street Carlifonia'
            />
          </Grid>

          <Grid item md={3} sm={6} xs={6}>
            <ControlledInput
              name='post_code'
              control={control}
              label='Post Code'
              error={errors.post_code}
              placeholder='LE3 HDS'
              maxLength={8}
              upperCaseValue
              inputAllowsOnly={[
                'letters',
                'numbers',
                'spaces',
              ]}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <CityPicker
              value={watch('city') || 0}
              handleChange={newValue => {
                setValue('city', Number(newValue) || 0)
                trigger('city')
              }}
              error={errors.city?.message}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <CountryPicker
              value={watch('country') || 0}
              handleChange={newValue => {
                setValue('country', Number(newValue) || 0)
                trigger('country')
              }}
              error={errors.country?.message}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 5,
          }}
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            type='submit'
          >
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default UpdateAddressModal
