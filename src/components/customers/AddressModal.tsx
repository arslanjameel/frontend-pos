import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Box, Button, Grid, Switch } from '@mui/material'

import { requiredMsg } from 'src/utils/formUtils'
import AppModal from '../global/AppModal'
import ControlledInput from '../global/ControlledInput'
import CountryPicker from '../global/CountryPicker'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { IAddress, IAddressNew } from 'src/models/IAddress'
import CityPicker from '../global/CityPicker'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (
    values: IAddressNew,
    reset?: () => void,
  ) => void
  data?: IAddress | false
}

const _defaultValues: IAddressNew = {
  country: 1,
  city: 1,
  addressNickName: '',
  fullName: '',
  addressType: 'billingAddress',
  addressLine1: '',
  addressLine2: '',
  postCode: '',
}

const AddressModal = ({
  open,
  handleClose,
  onSubmit,
  data,
}: Props) => {
  const { isMobileSize } = useWindowSize()
  const schema = yup.object().shape({
    addressNickName: yup
      .string()
      .required(requiredMsg('Nickname')),
    fullName: yup.string().optional(),
    addressLine1: yup
      .string()
      .required(requiredMsg('Address Line 1')),
    addressLine2: yup
      .string()
      .required(requiredMsg('Address Line 2')),
    city: yup
      .number()
      .min(1, requiredMsg('City'))
      .required(requiredMsg('City')),
    country: yup
      .number()
      .min(1, requiredMsg('Country'))
      .required(requiredMsg('Country')),
    postCode: yup
      .string()
      .required(requiredMsg('Post Code')),

    defaultShipping: yup.boolean().optional(),
    defaultBilling: yup.boolean().optional(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    values: { ..._defaultValues, ...data },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const _submit = (values: IAddressNew) => {
    onSubmit(values, reset)
  }

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      sx={{ p: 6, px: isMobileSize ? 4 : 6 }}
      title={data ? 'Edit Address' : 'Add New Address'}
    >
      <form onSubmit={handleSubmit(_submit)}>
        <Box sx={{ mb: 4 }}>
          <Grid container columns={12} spacing={4}>
            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='addressNickName'
                control={control}
                label='Address Nickname'
                error={errors.addressNickName}
                placeholder='John'
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='fullName'
                control={control}
                label='Full Name'
                error={errors.fullName}
                placeholder='John'
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='addressLine1'
                control={control}
                label='Address Line 1'
                error={errors.addressLine1}
                placeholder='12, Business Park'
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='addressLine2'
                control={control}
                label='Address Line 2'
                error={errors.addressLine2}
                placeholder='Mail Road'
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <CityPicker
                value={watch('city')}
                handleChange={newValue =>
                  setValue('city', Number(newValue) || 0)
                }
                error={errors.city?.message}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <ControlledInput
                name='postCode'
                control={control}
                label='Post Code'
                error={errors.postCode}
                placeholder='21222'
                maxLength={8}
                upperCaseValue
                inputAllowsOnly={[
                  'letters',
                  'numbers',
                  'spaces',
                ]}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <CountryPicker
                value={watch('country')}
                handleChange={newValue =>
                  setValue('country', Number(newValue) || 0)
                }
                error={errors.country?.message}
              />
            </Grid>
          </Grid>
        </Box>
        <label>
          <Box sx={{ transform: 'translateX(-10px)' }}>
            <Switch
              checked={watch('defaultBilling')}
              onChange={e =>
                setValue('defaultBilling', e.target.checked)
              }
              inputProps={{ 'aria-label': 'controlled' }}
            />
            Use as billing address
          </Box>
        </label>

        <label>
          <Box sx={{ transform: 'translateX(-10px)' }}>
            <Switch
              checked={watch('defaultShipping')}
              onChange={e =>
                setValue(
                  'defaultShipping',
                  e.target.checked,
                )
              }
              inputProps={{ 'aria-label': 'controlled' }}
            />
            Use as shipping address
          </Box>
        </label>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default AddressModal
