import {
  Box,
  Button,

  // Divider,
  Grid,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  EmailRegex,
  emailInvalidErr,
  passwordMinErr,
  requiredMsg,
} from 'src/utils/formUtils'
import ControlledInput from '../global/ControlledInput'
import CountryPicker from '../global/CountryPicker'
import AppSelect from '../global/AppSelect'
import CityPicker from '../global/CityPicker'
import { IStoreNew, IStore } from 'src/models/IStore'
import {
  accountApi,
  useGetBusinessBankAccountsQuery,
} from 'src/store/apis/accountSlice'

// import UserInfoCard from '../userAccounts/UserInfoCard'
import UncontrolledInput from '../global/UncontrolledInput'
import { inputAllows } from 'src/utils/inputUtils'
import MaskedInput from '../global/MaskedInput'
import capitalize from 'src/utils/capitalize'
import { BUSINESS_ID } from 'src/utils/globalConstants'
import { sendEmailWithAttachment } from 'src/services/email.service'
import { useAppSelector } from 'src/store/hooks'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import toast from 'react-hot-toast'
import { PLACEHOLDER_PHONE_NUMBER } from 'src/utils/constants/formPlaceholders'

interface Props {
  isView?: boolean
  defaultValues?: IStore
  onSubmit?: (values: IStore | IStoreNew) => void
  actionBtns: React.ReactNode
}

const _defaultValues = {
  name: '',
  storeType: '',
  store_initial: '',
  email: '',
  storeEmailPassword: '',
  storeAddress: '',
  city: 1,
  country: 1,
  postalCode: '',
  phone: '',
  isActive: true,
  business: BUSINESS_ID,
  bank_account: 0,
}

const StoreFormInputs = ({
  isView,
  defaultValues,
  onSubmit,
  actionBtns,
}: Props) => {
  const { store } = useAppSelector(state => state.app)

  const schema = yup.object().shape({
    name: yup.string().required(requiredMsg('Store Name')),
    storeType: yup
      .string()
      .required(requiredMsg('Store Type')),
    store_initial: yup
      .string()
      .max(2)
      .required(
        'Store Initials are required to be 2 characters long',
      ),
    email: yup
      .string()
      .matches(EmailRegex, emailInvalidErr())
      .required(requiredMsg('Store Email')),
    storeEmailPassword: yup
      .string()
      .min(8, passwordMinErr())
      .required(requiredMsg('Password')),
    storeAddress: yup.string().optional(),
    city: yup.number().required(requiredMsg('City')),
    country: yup.number().required(requiredMsg('Country')),
    postalCode: yup
      .string()
      .required(requiredMsg('Post Code')),
    phone: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Store Phone')),
    bank_account: yup
      .number()
      .min(1, requiredMsg('Bank Account'))
      .required(requiredMsg('Bank Account')),
  })

  const _defaults = defaultValues ? defaultValues : {}

  const {
    control,
    watch,
    getValues,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      ..._defaultValues,
      ..._defaults,
      bankAccName: '',
      sortCode: '',
      bankName: '',
      accountNumber: 0,

      // storeLogo: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const { data: bankInfo } =
    useGetBusinessBankAccountsQuery(
      defaultValues ? watch('bank_account') : BUSINESS_ID,
    )

  const [getBankAccInfo] =
    accountApi.endpoints.getBusinessBankAccounts.useLazyQuery()

  const updateBankInfo = useCallback(async (id: number) => {
    const { data } = await getBankAccInfo(BUSINESS_ID)
    if (data) {
      const bank = (data?.results || []).find(
        (b: any) => b.id === id,
      )

      if (bank) {
        setValue('sortCode', bank.sortCode)
        setValue('bankName', bank.bankName)
        setValue('bankAccName', bank.bankAccountTitle)
        setValue('accountNumber', bank.accountNumber)

        setValue('bank_account', bank.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBankSelection = (id: number) => {
    updateBankInfo(id)
  }

  //test email
  const testEmail = async () => {
    const res = await sendEmailWithAttachment({
      email: getValues('email'),
      email_body: 'Email works perfectly',
      email_title: 'Testing Email Functionality',
      store_id: store?.id.toString(),
      file: new File([], 'blank.png'),
    })

    if (hasErrorKey(res as any)) {
      toast.error(extractErrorMessage(res as any))
    } else {
      toast.success('Email tested successfully')
    }
  }

  useEffect(() => {
    if (defaultValues) {
      updateBankInfo(defaultValues.bank_account)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  return (
    <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
      <Typography
        fontWeight={600}
        fontSize={20}
        sx={{ mb: 4 }}
      >
        Store Details
      </Typography>
      {/* <UserInfoCard
        legacy

        // currentImage={getValues('storeLogo')}
        // handleImageChange={file => setValue('storeLogo', file)}
      /> */}

      {/* <Divider sx={{ my: 4 }} /> */}

      <Grid container columns={12} spacing={4}>
        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='name'
            control={control}
            label='Store Name'
            error={errors.name}
            placeholder='Store Name'
            disabled={isView}
            capitalizeValue
            inputAllowsOnly={[
              'letters',
              'numbers',
              'spaces',
            ]}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <AppSelect
            disabled={isView}
            label='Store Type'
            placeholder='Store Type'
            value={watch('storeType')}
            handleChange={e =>
              setValue('storeType', e.target.value)
            }
            options={['B2B', 'B2C'].map(v => ({
              label: v,
              value: v,
            }))}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <MaskedInput
            label='Store Phone Number'
            format='phone'
            value={watch('phone')}
            placeholder={PLACEHOLDER_PHONE_NUMBER}
            onChange={newValue =>
              setValue('phone', newValue)
            }
            onBlur={() => trigger('phone')}
            disabled={isView}
            error={errors.phone?.message}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='store_initial'
            control={control}
            disabled={isView}
            label='Store Initials'
            error={errors.store_initial}
            placeholder='Store Initials'
            maxLength={2}
            customChange={val =>
              setValue(
                'store_initial',
                inputAllows(val.toUpperCase(), ['letters']),
              )
            }
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          BANK ACC: {JSON.stringify(watch('bank_account'))}
          <br />
          BUSiNESS: {JSON.stringify(watch('business'))}
          <br />
          <AppSelect
            label='Bank Account'
            error={errors.bank_account?.message}
            placeholder='QUGSGAY5676YQ'
            options={
              bankInfo
                ? bankInfo.results.map((b: any) => ({
                    ...b,
                    label: b.bankAccountTitle,
                    value: b.id,
                  }))
                : []
            }
            value={watch('bank_account')}
            handleChange={e => {
              handleBankSelection(e.target.value)
            }}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='bankName'
            control={control}
            disabled={isView}
            label='Account Name'
            error={errors.bankName}
            placeholder='BPM632TWN'
            readOnly
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <UncontrolledInput
            label='Account Number'
            error={errors.accountNumber}
            placeholder='QUGSGAY5676YQ'
            maxLength={8}
            value={
              watch('accountNumber') !== 0
                ? watch('accountNumber')
                : ''
            }
            inputType='number'
            onChange={newVal =>
              setValue('accountNumber', Number(newVal))
            }
            onBlur={() => trigger('accountNumber')}
            disabled={isView}
            readOnly
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <MaskedInput
            label='Sort Code'
            format='sortCode'
            value={watch('sortCode')}
            placeholder='67-87-58'
            onChange={newValue =>
              setValue('sortCode', newValue)
            }
            onBlur={() => trigger('sortCode')}
            disabled={isView}
            readOnly
            error={errors.sortCode?.message}
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <Box sx={{ position: 'relative' }}>
                <CustomTextField
                  fullWidth
                  label='Store Email Address'
                  value={value}
                  disabled={isView}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='john.doe@gmail.com'
                  error={Boolean(errors.email)}
                  {...(errors.email && {
                    helperText: errors.email.message,
                  })}
                />
                <Button
                  disabled={Boolean(errors.email)}
                  variant='tonal'
                  sx={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    transform: errors.email
                      ? 'translateY(-50%)'
                      : 0,
                  }}
                  onClick={testEmail}
                >
                  Test Email
                </Button>
              </Box>
            )}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='storeEmailPassword'
            control={control}
            disabled={isView}
            label='Password'
            error={errors.storeEmailPassword}
            placeholder='******'
            inputType='password'
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <UncontrolledInput
            label='Address'
            value={watch('storeAddress')}
            onChange={newVal =>
              setValue(
                'storeAddress',
                capitalize(
                  inputAllows(newVal, [
                    'letters',
                    'numbers',
                    'spaces',
                  ]),
                ),
              )
            }
            onBlur={() => trigger('storeAddress')}
            disabled={isView}
            error={errors.storeAddress}
            placeholder='Carlifonia'
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <ControlledInput
            name='postalCode'
            control={control}
            label='Post Code'
            error={errors.postalCode}
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

        <Grid item md={6} sm={12} xs={12}>
          <CountryPicker
            disabled={isView}
            value={watch('country')}
            handleChange={newValue =>
              setValue('country', newValue)
            }
            error={errors.country?.message}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <CityPicker
            disabled={isView}
            value={watch('city')}
            handleChange={newValue =>
              setValue('city', newValue)
            }
            error={errors.city?.message}
          />
        </Grid>
      </Grid>

      {actionBtns}
    </form>
  )
}

export default StoreFormInputs
