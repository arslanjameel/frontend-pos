import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import * as yup from 'yup'

import PageContainer from '../global/PageContainer'
import {
  ICustomer,
  ICustomerNew,
  IPriceBand,
} from 'src/models/ICustomer'
import { useAuth } from 'src/hooks/useAuth'
import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'

// import UserInfoCard from '../userAccounts/UserInfoCard'
import CustomerFormInputs from './CustomerFormInputs'
import ControlledInput from '../global/ControlledInput'
import CityPicker from '../global/CityPicker'
import CountryPicker from '../global/CountryPicker'
import { getFullName } from 'src/utils/dataUtils'
import { BUSINESS_ID } from 'src/utils/globalConstants'
import { PLACEHOLDER_POST_CODE } from 'src/utils/constants/formPlaceholders'

interface FormData {
  accountName: string
  email: string
  firstName: string
  lastName: string
  primaryPhone: string
  secondPhone: string
  priceBand: IPriceBand
  creditLimit: string

  /**
   * Billing Address
   */
  addressName: string
  addressLine: string
  postCode: string
  city: number
  country: number

  /**
   * Shipping Address
   */

  shippingAddressName: string
  shippingAddressLine: string
  shippingPostCode: string
  shippingCity: number
  shippingCountry: number
}

const _defaultValues: ICustomerNew = {
  addresses: [],
  accountName: '',
  firstName: '',
  lastName: '',
  email: '',
  primaryPhone: '',
  secondPhone: '',
  priceBand: 'Band_C',
  accountType: 'account',
  currentCredit: '',
  creditLimit: '',
  createdBy: 0,
  business: 2,
}

const _addressInfo = {
  addressName: '',
  addressLine: '',
  postCode: '',
  city: 1,
  country: 1,

  shippingAddressName: '',
  shippingAddressLine: '',
  shippingPostCode: '',
  shippingCity: 1,
  shippingCountry: 1,
}

interface Props {
  defaultValues?: ICustomer
  onSubmit: (values: ICustomerNew) => void
}

const CustomerForm = ({
  defaultValues,
  onSubmit,
}: Props) => {
  const { user } = useAuth()
  const router = useRouter()

  const schema = yup.object().shape({
    accountName: yup
      .string()
      .required(requiredMsg('Account Name')),
    email: yup
      .string()
      .matches(EmailRegex, emailInvalidErr())
      .required(requiredMsg('Email')),
    firstName: yup
      .string()
      .required(requiredMsg('First Name')),
    lastName: yup
      .string()
      .required(requiredMsg('Last Name')),
    primaryPhone: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Primary Phone')),
    priceBand: yup
      .string()
      .required(requiredMsg('Price Band')),
    creditLimit: yup
      .string()
      .required(requiredMsg('Credit Limit')),

    /**
     * Billing Address
     */
    addressName: yup
      .string()
      .required('Address Name is required'),
    addressLine: yup
      .string()
      .required('Address Line is required'),
    postCode: yup
      .string()
      .required('Post Code is required'),
    city: yup.number().required('City is required'),
    country: yup.number().required('Country is required'),

    /**
     * Shipping Address
     */

    shippingAddressName: yup
      .string()
      .required('Address Name is required'),
    shippingAddressLine: yup
      .string()
      .required('Address Line is required'),
    shippingPostCode: yup
      .string()
      .required('Post Code is required'),
    shippingCity: yup.number().required('City is required'),
    shippingCountry: yup
      .number()
      .required('Country is required'),
  })

  const [sameAsBilling, setSameAsBilling] = useState(false)

  const _onSubmit = (values: FormData) => {
    onSubmit({
      accountName: values.accountName,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      primaryPhone: values.primaryPhone,
      secondPhone: values.secondPhone,
      priceBand: values.priceBand,
      creditLimit: values.creditLimit,
      accountType: 'account',
      business: BUSINESS_ID,
      addresses: [
        {
          addressNickName: values.firstName + ' - billing',
          fullName: getFullName(values),
          addressLine1: values.addressName,
          addressLine2: values.addressLine,
          addressType: 'billingAddress',
          city: values.city,
          country: values.country,
          postCode: values.postCode,
        },
        {
          addressNickName: values.firstName + ' - shipping',
          fullName: getFullName(values),
          addressLine1: values.shippingAddressName,
          addressLine2: values.shippingAddressLine,
          addressType: 'shippingAddress',
          city: values.shippingCity,
          country: values.shippingCountry,
          postCode: values.shippingPostCode,
        },
      ],
      createdBy: user ? user.id : 0,
      currentCredit: '0',
    })
  }

  const _defaults = defaultValues
    ? {
        ...defaultValues,
        addressName:
          defaultValues.addresses[0].addressLine1,
        addressLine:
          defaultValues.addresses[0].addressLine2,
        postCode: defaultValues.addresses[0].postCode,
        city: defaultValues.addresses[0].city,
        country: defaultValues.addresses[0].country,

        shippingAddressName:
          defaultValues.addresses[1].addressLine1,
        shippingAddressLine:
          defaultValues.addresses[1].addressLine2,
        shippingPostCode:
          defaultValues.addresses[1].postCode,
        shippingCity: defaultValues.addresses[1].city,
        shippingCountry: defaultValues.addresses[1].country,
      }
    : {}

  const {
    watch,
    control,
    getValues,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    values: {
      ..._defaultValues,
      ..._addressInfo,
      ..._defaults,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const copyBillingToShipping = (checked: boolean) => {
    setValue(
      'shippingAddressLine',
      checked ? getValues('addressLine') : '',
    )
    setValue(
      'shippingAddressName',
      checked ? getValues('addressName') : '',
    )
    setValue(
      'shippingCity',
      checked ? getValues('city') : 1,
    )
    setValue(
      'shippingCountry',
      checked ? getValues('country') : 1,
    )
    setValue(
      'shippingPostCode',
      checked ? getValues('postCode') : '',
    )
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: 'Customers', to: '/customers' },
        { label: defaultValues ? 'Edit' : 'Add', to: '#' },
      ]}
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        <Card>
          <Box sx={{ p: 6, pb: 0, pt: 4 }}>
            <Typography
              variant='h5'

              //  sx={{ mb: 2 }}
            >
              Customer Details
            </Typography>

            {/* <UserInfoCard
              legacy
              primaryBtnText='Upload new photo'
            /> */}
          </Box>

          <CustomerFormInputs
            control={control}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
          />
        </Card>

        <Grid
          container
          columns={12}
          spacing={5}
          sx={{ mt: 2 }}
        >
          {/*
           *
           * Billing Address Section
           *
           */}
          <Grid item md={6} sm={12} xs={12}>
            <Card sx={{ p: 6, pt: 3 }}>
              <Box
                sx={{
                  mt: 2,
                  mb: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h5' fontWeight={600}>
                  Billing Address
                </Typography>
              </Box>

              <Grid container columns={6} spacing={5}>
                <Grid item md={6} sm={6} xs={6}>
                  <ControlledInput
                    name='addressName'
                    control={control}
                    label='Address Name'
                    error={errors.addressName}
                    placeholder='Utah'
                    capitalizeValue
                    customChange={val => {
                      if (sameAsBilling)
                        setValue('shippingAddressName', val)
                    }}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={6}>
                  <ControlledInput
                    name='addressLine'
                    control={control}
                    label='Address Line'
                    error={errors.addressLine}
                    placeholder='323'
                    capitalizeValue
                    customChange={val => {
                      if (sameAsBilling)
                        setValue('shippingAddressLine', val)
                    }}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <ControlledInput
                    name='postCode'
                    control={control}
                    label='Post Code'
                    error={errors.postCode}
                    placeholder={PLACEHOLDER_POST_CODE}
                    maxLength={8}
                    upperCaseValue
                    inputAllowsOnly={[
                      'letters',
                      'numbers',
                      'spaces',
                    ]}
                    customChange={val => {
                      if (sameAsBilling)
                        setValue('shippingPostCode', val)
                    }}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <CountryPicker
                    value={watch('country')}
                    handleChange={newValue => {
                      setValue('country', newValue)
                      if (sameAsBilling)
                        setValue(
                          'shippingCountry',
                          newValue,
                        )
                    }}
                    error={errors.country?.message}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <CityPicker
                    value={watch('city')}
                    handleChange={newValue =>
                      setValue('city', newValue)
                    }
                    error={errors.city?.message}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          {/*
           *
           * Shipping Address Section
           *
           */}
          <Grid item md={6} sm={12} xs={12}>
            <Card sx={{ p: 6, pt: 3 }}>
              <Box
                sx={{
                  mb: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant='h5' fontWeight={600}>
                  Shipping Address
                </Typography>

                <FormControlLabel
                  value='end'
                  control={
                    <Checkbox
                      checked={sameAsBilling}
                      onChange={e => {
                        copyBillingToShipping(
                          e.target.checked,
                        )
                        setSameAsBilling(e.target.checked)
                      }}
                    />
                  }
                  label='Same as billing address'
                  labelPlacement='end'
                />
              </Box>

              <Grid container columns={6} spacing={5}>
                <Grid item md={6} sm={6} xs={6}>
                  <ControlledInput
                    name='shippingAddressName'
                    control={control}
                    label='Address Line'
                    error={errors.shippingAddressName}
                    placeholder='Utah'
                    capitalizeValue
                    disabled={sameAsBilling}
                  />
                </Grid>

                <Grid item md={6} sm={6} xs={6}>
                  <ControlledInput
                    name='shippingAddressLine'
                    control={control}
                    label='Address Line'
                    error={errors.shippingAddressLine}
                    placeholder='623'
                    capitalizeValue
                    disabled={sameAsBilling}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <ControlledInput
                    name='shippingPostCode'
                    control={control}
                    label='Post Code'
                    error={errors.shippingPostCode}
                    placeholder={PLACEHOLDER_POST_CODE}
                    disabled={sameAsBilling}
                    maxLength={8}
                    upperCaseValue
                    inputAllowsOnly={[
                      'letters',
                      'numbers',
                      'spaces',
                    ]}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <CountryPicker
                    value={watch('shippingCountry')}
                    handleChange={newValue =>
                      setValue('shippingCountry', newValue)
                    }
                    error={errors.shippingCountry?.message}
                    disabled={sameAsBilling}
                  />
                </Grid>

                <Grid item md={2} sm={6} xs={6}>
                  <CityPicker
                    value={watch('shippingCity')}
                    handleChange={newValue =>
                      setValue('shippingCity', newValue)
                    }
                    error={errors.shippingCity?.message}
                    disabled={sameAsBilling}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            py: 4,
          }}
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            type='submit'
          >
            {defaultValues ? 'Edit' : 'Create'} Account
          </Button>
        </Box>
      </form>
    </PageContainer>
  )
}

export default CustomerForm
