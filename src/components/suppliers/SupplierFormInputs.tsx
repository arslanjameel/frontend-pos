import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'

import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import ControlledInput from '../global/ControlledInput'
import AppSelectMultiple from '../global/AppSelectMultiple'
import { daysOfWeek } from 'src/utils/daysOfWeek'

// import UserInfoCard from '../userAccounts/UserInfoCard'
import CountryPicker from '../global/CountryPicker'
import DualTimePicker from '../global/DualTimePicker'
import MaskedInput from '../global/MaskedInput'
import {
  ISupplier,
  ISupplierNew,
} from 'src/models/ISupplier'
import CityPicker from '../global/CityPicker'

interface Props {
  isView?: boolean
  defaultValues?: ISupplier | ISupplierNew
  onSubmit?: (values: ISupplierNew) => void
  actionBtns?: React.ReactNode
}

const _defaultValues: ISupplierNew = {
  name: '',
  city: 1,
  country: 1,
  email: '',
  address: '',
  post_code: '',
  primary_phone: '',
  second_phone: '',
  current_credit: '',
  company_number: '',
  bank_account_name: '',
  credit_limit: '',
  vat_number: '',
  account_number: '',
  sort_code: '',
  opening_hours: '',
  closing_hours: '',
}

// const _defaultValues: ISupplierNew = {
//   current_credit: 0,
//   credit_limit: 0,
//   opening_hours: '09:00',
//   closing_hours: '17:00',

//   daysOfWeek: [],
//   addressLine: '',
//   address: '',
//   addressLine2: '',
//   city: 0,
//   post_code: '',
//   country: 0,
//   company_number: '',
//   vat_number: '',
//   bank_account_name: '',
//   account_number: 0,
//   sortCode: '',

//   name: '',
//   email: '',
//   address: '',
//   primary_phone: '',
//   second_phone: '',
//   spendToDate: 0,
//   accBalance: 0,
// }

const SupplierFormInputs = ({
  isView,
  defaultValues,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .required(requiredMsg('Supplier Name')),
    email: yup
      .string()
      .matches(EmailRegex, emailInvalidErr())
      .required(requiredMsg('Email')),
    primary_phone: yup.string().nullable().optional(),
    current_credit: yup.string().nullable().optional(),
    credit_limit: yup.string().nullable().optional(),
    opening_hours: yup.string().nullable().optional(),
    closing_hours: yup.string().nullable().optional(),
    daysOfWeek: yup.array().nullable().optional(),
    addressLine: yup.string().nullable().optional(),
    address: yup.string().nullable().optional(),
    addressLine2: yup.string().nullable().optional(),
    city: yup.string().nullable().optional(),
    post_code: yup.string().nullable().optional(),
    country: yup.number().nullable().optional(),
    company_number: yup.string().nullable().optional(),
    vat_number: yup.string().nullable().optional(),
    bank_account_name: yup.string().nullable().optional(),
    account_number: yup.string().nullable().optional(),
    sort_code: yup.string().nullable().optional(),
  })

  const {
    watch,
    setValue,
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      daysOfWeek: [],
      addressLine2: '',
      ..._defaultValues,
      ...defaultValues,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const submitForm = (supplier: ISupplierNew) => {
    const _supplier = Object.entries(supplier).reduce(
      (a: any, [k, v]: [string, any]) =>
        v ? ((a[k] = v), a) : a,
      {},
    )

    onSubmit && onSubmit(_supplier as ISupplierNew)
  }

  return (
    <form onSubmit={onSubmit && handleSubmit(submitForm)}>
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography
          fontWeight={600}
          variant='h4'

          // sx={{ mb: 4 }}
        >
          Supplier Details
        </Typography>
        {/* <UserInfoCard legacy /> */}

        <Box
          sx={{
            // borderTop: '2px solid #dedede87',
            // mt: 4,
            pt: 4,
          }}
        >
          <Grid container columns={12} spacing={4}>
            <Grid item md={6} sm={12} xs={12}>
              <ControlledInput
                name='name'
                control={control}
                disabled={isView}
                label='Supplier Name'
                error={errors.name}
                placeholder='John Store'
                capitalizeValue
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <ControlledInput
                name='email'
                control={control}
                disabled={isView}
                label='Email'
                error={errors.email}
                placeholder='john.doe@gmail.com'
                inputType='email'
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <MaskedInput
                format='phone'
                label='Primary Phone Number'
                placeholder='6787 587 3365'
                error={errors.primary_phone?.message}
                value={watch('primary_phone') || ''}
                onChange={newVal => {
                  setValue('primary_phone', newVal)
                  trigger('primary_phone')
                }}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <MaskedInput
                format='phone'
                label='Secondary Phone Number'
                placeholder='6787 587 3365'
                error={errors.second_phone?.message}
                value={watch('second_phone') || ''}
                onChange={newVal => {
                  setValue('second_phone', newVal)
                  trigger('second_phone')
                }}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <ControlledInput
                name='current_credit'
                control={control}
                disabled={isView}
                label='Current Credit'
                error={errors.current_credit}
                placeholder='200'
                inputType='number'
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <ControlledInput
                name='credit_limit'
                control={control}
                disabled={isView}
                label='Credit Limit'
                error={errors.credit_limit}
                placeholder='200'
                inputType='number'
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <AppSelectMultiple
                label='Open Days'
                placeholder='Open Days'
                options={daysOfWeek}
                value={watch('daysOfWeek') || []}
                handleChange={e =>
                  setValue('daysOfWeek', e.target.value)
                }
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DualTimePicker
                label='Opening Hours'
                values={[
                  watch('opening_hours'),
                  watch('closing_hours'),
                ]}
                onChange={values => {
                  setValue('opening_hours', values[0])
                  setValue('closing_hours', values[1])
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Grid container columns={12} spacing={4}>
        <Grid item md={6} sm={12} xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography
              variant='h5'
              fontWeight={600}
              marginBottom={4}
            >
              Address
            </Typography>
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
                  disabled={isView}
                  label='Address Line 1'
                  error={errors.address}
                  placeholder='12 Street Carlifonia'
                />
              </Grid>
              <Grid item md={6} sm={6} xs={6}>
                <ControlledInput
                  name='addressLine2'
                  control={control}
                  disabled={isView}
                  label='Address Line 2'
                  error={errors.addressLine2}
                  placeholder='12 Street Carlifonia'
                />
              </Grid>

              <Grid item md={2} sm={6} xs={6}>
                <ControlledInput
                  name='post_code'
                  control={control}
                  label='Post Code'
                  error={errors.post_code}
                  placeholder='LE3 HDS'
                  maxLength={8}
                  disabled={isView}
                  upperCaseValue
                  inputAllowsOnly={[
                    'letters',
                    'numbers',
                    'spaces',
                  ]}
                />
              </Grid>
              <Grid item md={2} sm={6} xs={6}>
                <CityPicker
                  value={watch('city') || 0}
                  handleChange={newValue => {
                    setValue('city', Number(newValue) || 0)
                    trigger('city')
                  }}
                  error={errors.city?.message}
                />
              </Grid>
              <Grid item md={2} sm={6} xs={6}>
                <CountryPicker
                  value={watch('country') || 0}
                  handleChange={newValue => {
                    setValue(
                      'country',
                      Number(newValue) || 0,
                    )
                    trigger('country')
                  }}
                  error={errors.country?.message}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography
              variant='h5'
              fontWeight={600}
              marginBottom={4}
            >
              Banking Details
            </Typography>

            <Grid
              container
              columns={6}
              sm={12}
              xs={12}
              spacing={4}
            >
              <Grid item md={3} sm={6} xs={6}>
                <ControlledInput
                  name='company_number'
                  control={control}
                  disabled={isView}
                  label='Company Number'
                  error={errors.company_number}
                  placeholder='37623'
                />
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <ControlledInput
                  name='vat_number'
                  control={control}
                  disabled={isView}
                  label='VAT Number'
                  error={errors.vat_number}
                  placeholder='37623'
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <ControlledInput
                  name='bank_account_name'
                  control={control}
                  disabled={isView}
                  label='Bank Account Name'
                  error={errors.bank_account_name}
                  placeholder='Bank Name'
                />
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <ControlledInput
                  name='account_number'
                  control={control}
                  disabled={isView}
                  label='Bank Account Number'
                  error={errors.account_number}
                  placeholder='37623'
                  maxLength={8}
                />
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <MaskedInput
                  format='sortCode'
                  label='Sort Code'
                  placeholder='327632'
                  error={errors.sort_code?.message}
                  value={watch('sort_code')}
                  onChange={newVal => {
                    setValue('sort_code', newVal)
                    trigger('sort_code')
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {!defaultValues && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mt: 5,
          }}
        >
          <Link href={'/suppliers'}>
            <Button variant='tonal' color='secondary'>
              Cancel
            </Button>
          </Link>
          <Button
            variant='contained'
            color='primary'
            type='submit'
          >
            Create Account
          </Button>
        </Box>
      )}
    </form>
  )
}

export default SupplierFormInputs
