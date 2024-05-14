import { Box, Typography, Grid, Card } from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import ControlledInput from '../global/ControlledInput'
import {
  EmailRegex,
  emailInvalidErr,
  passwordMinErr,
  requiredMsg,
} from 'src/utils/formUtils'
import { useAppSelector } from 'src/store/hooks'
import CountryPicker from '../global/CountryPicker'
import { IUser, IUserWithID } from 'src/models/IUser'
import CityPicker from '../global/CityPicker'
import { PLACEHOLDER_PHONE_NUMBER } from 'src/utils/constants/formPlaceholders'

interface Props {
  headerShown?: boolean
  isView?: boolean
  userId?: number
  brief?: boolean
  defaultValues?: IUser | IUserWithID
  onChange?: (values: FormData) => void
  onSubmit?: (values: FormData) => void
  hasForm?: boolean
  actionBtns?: React.ReactNode
  headerSection?: React.ReactNode
  hidePassword?: boolean
}

interface FormData {
  first_name: string
  last_name: string
  password: string
  verifyPassword?: string
  pin_code: string
  verifyPinCode?: string
  email: string
  mobile: string
  address: string
  city: number
  country: number
  postalCode: string
}

const _defaultValues = {
  first_name: '',
  last_name: '',
  password: '',
  verifyPassword: '',
  pin_code: '',
  verifyPinCode: '',
  email: '',
  mobile: '',
  address: '',
  city: 1,
  country: 1,
  postalCode: '',
}

const UserInfo = ({
  defaultValues,
  headerShown = true,
  isView = false,
  brief = false,
  onSubmit,
  hasForm = true,
  actionBtns,
  headerSection,
  hidePassword = brief,
}: Props) => {
  // Making password and pincode not optional for edit pages to
  // avoid editing password and pincode for a usr everytime

  const passwordYup = hidePassword
    ? yup.string().optional()
    : yup
        .string()
        .min(8, passwordMinErr())
        .required(requiredMsg('Password'))

  const verifyPasswordYup = hidePassword
    ? yup.string().optional()
    : yup
        .string()
        .required('Please confirm your Password')
        .oneOf(
          [yup.ref('password'), ''],
          'Passwords must match',
        )

  const pincodeYup = hidePassword
    ? yup.string().nullable().optional()
    : yup
        .string()
        .nullable()
        .min(6, 'Pin must have at least 6 characters')
        .required(requiredMsg('Pin Code'))
  const verifyPincodeYup = hidePassword
    ? yup.string().optional()
    : yup
        .string()
        .min(6, 'Pin must have at least 6 characters')
        .required(requiredMsg('Pin Code'))

  const schema = yup.object().shape({
    first_name: yup
      .string()
      .required(requiredMsg('First Name')),
    last_name: yup
      .string()
      .required(requiredMsg('Last Name')),
    password: passwordYup,
    verifyPassword: verifyPasswordYup,
    pin_code: pincodeYup,
    verifyPinCode: verifyPincodeYup,
    email: yup
      .string()
      .matches(EmailRegex, emailInvalidErr())
      .required(requiredMsg('Email')),
    mobile: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Mobile')),
    address: yup.string().required(requiredMsg('Address')),
    city: yup
      .string()
      .min(1, requiredMsg('City'))
      .required(requiredMsg('City')),
    country: yup
      .string()
      .min(1, requiredMsg('Country'))
      .required(requiredMsg('Country')),
    postalCode: yup
      .string()
      .required(requiredMsg('Post Code')),
  })
  const step1 = useAppSelector(
    state => state.userAccounts.createUserSteps.step1,
  )

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      ..._defaultValues,
      ...step1,
      ...defaultValues,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const Inputs = () => (
    <Grid container columns={12} spacing={4}>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='first_name'
          control={control}
          label='First Name'
          error={errors.first_name}
          placeholder='John'
          disabled={isView}
          capitalizeValue
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='last_name'
          control={control}
          label='Last Name'
          error={errors.last_name}
          placeholder='Doe'
          disabled={isView}
          capitalizeValue
        />
      </Grid>
      {!hidePassword && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='password'
            control={control}
            label='Password'
            error={errors.password}
            placeholder='******'
            disabled={isView}
            inputType='password'
          />
        </Grid>
      )}
      {!hidePassword && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='verifyPassword'
            control={control}
            label='Verify Password'
            error={errors.verifyPassword}
            placeholder='******'
            disabled={isView}
            inputType='password'
          />
        </Grid>
      )}
      {!brief && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='pin_code'
            control={control}
            label='Pin Code'
            error={errors.pin_code}
            placeholder='******'
            disabled={isView}
            inputType='pinCode'
            maxLength={6}
          />
        </Grid>
      )}
      {!brief && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='verifyPinCode'
            control={control}
            label='Verify Pin Code'
            error={errors.verifyPinCode}
            placeholder='******'
            disabled={isView}
            inputType='pinCode'
            maxLength={6}
          />
        </Grid>
      )}

      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='email'
          control={control}
          label='Email'
          error={errors.email}
          placeholder='john.doe@gmail.com'
          disabled={isView}
          inputType='email'
          lowerCaseValue
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          label='Mobile'
          name='mobile'
          control={control}
          error={errors.mobile}
          placeholder={PLACEHOLDER_PHONE_NUMBER}
          disabled={isView}
          inputType='tel'
        />
      </Grid>
      {brief && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='password'
            control={control}
            label='Password'
            error={errors.password}
            placeholder='******'
            disabled={isView}
            inputType='password'
          />
        </Grid>
      )}

      {brief && (
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='pin_code'
            control={control}
            label='Pin Code'
            error={errors.pin_code}
            placeholder='******'
            disabled={isView}
            inputType='pinCode'
            maxLength={6}
          />
        </Grid>
      )}

      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='address'
          control={control}
          label='Address'
          error={errors.address}
          placeholder='Address'
          disabled={isView}
          capitalizeValue
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <CountryPicker
          disabled={isView}
          value={Number(watch('country'))}
          handleChange={newValue =>
            setValue('country', newValue)
          }
          error={errors.country?.message}
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <CityPicker
          disabled={isView}
          value={Number(watch('city'))}
          handleChange={newValue =>
            setValue('city', newValue)
          }
          error={errors.city?.message}
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <ControlledInput
          name='postalCode'
          control={control}
          label='Post Code'
          error={errors.postalCode}
          placeholder='21222'
          maxLength={8}
          disabled={isView}
          upperCaseValue
          inputAllowsOnly={['letters', 'numbers', 'spaces']}
        />
      </Grid>
    </Grid>
  )

  const FormInput = () => (
    <>
      {headerShown && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            pb: 4,
          }}
        >
          <Typography fontWeight={600} fontSize={20}>
            User Details
          </Typography>
          <Typography>Enter the User Details</Typography>
        </Box>
      )}

      {headerSection && headerSection}

      {headerSection ? (
        <Card sx={{ p: 4 }}>
          <Inputs />
        </Card>
      ) : (
        <Inputs />
      )}

      {actionBtns && actionBtns}
    </>
  )

  return hasForm ? (
    <form
      onSubmit={
        onSubmit ? handleSubmit(onSubmit) : undefined
      }
    >
      <FormInput />
    </form>
  ) : (
    <FormInput />
  )
}

export default UserInfo
