import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import { daysOfWeek } from 'src/utils/daysOfWeek'

// import UserInfoCard from 'src/components/userAccounts/UserInfoCard'
import ControlledInput from 'src/components/global/ControlledInput'
import AppSelectMultiple from 'src/components/global/AppSelectMultiple'
import AddressInfo from 'src/components/global/AddressInfo'
import { useModal } from 'src/hooks/useModal'
import UpdateAddressModal from 'src/components/suppliers/UpdateAddressModal'
import BankInfo from 'src/components/global/BankInfo'
import UpdateBankModal from 'src/components/suppliers/UpdateBankModal'
import DualTimePicker from 'src/components/global/DualTimePicker'
import MaskedInput from 'src/components/global/MaskedInput'
import {
  ISupplier,
  ISupplierBankInfo,
  ISupplierNew,
} from 'src/models/ISupplier'
import { useUpdateSupplierMutation } from 'src/store/apis/suppliersSlice'
import useGetCityName from 'src/hooks/useGetCityName'
import useGetCountryName from 'src/hooks/useGetCountryName'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import Can from 'src/layouts/components/acl/Can'

interface Props {
  isView?: boolean
  defaultValues?: ISupplier
  onSubmit?: (values: ISupplierNew) => void
  actionBtns?: React.ReactNode
}

const _defaultValues: ISupplierNew = {
  name: '',
  city: 0,
  country: 0,
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

const SupplierDetailsTab = ({
  isView,
  defaultValues = {
    ..._defaultValues,
    id: 0,
    created_at: '',
  },
}: Props) => {
  const { getCity } = useGetCityName()
  const { getCountry } = useGetCountryName()

  const [updateSupplier] = useUpdateSupplierMutation()

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
    // modalData: addressModal,
    openModal: openAddressModal,
    closeModal: closeAddressModal,
    isModalOpen: addressModalStatus,
  } = useModal<any>()
  const {
    openModal: openBankInfoModal,
    closeModal: closeBankInfoModal,
    isModalOpen: bankInfoModalStatus,
  } = useModal<ISupplierBankInfo>()

  const {
    watch,
    setValue,
    control,
    trigger,
    reset,

    // handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    values: { daysOfWeek: [], ...defaultValues },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const handleAddressUpdate = (values: {
    address: string
    post_code: string
    city: number | null
    country: number | null
  }) => {
    if (defaultValues) {
      // const updatedValues = { ...defaultValues, ...values }

      updateSupplier({ id: defaultValues.id, body: values })
        .unwrap()
        .then((res: any) => {
          if (hasErrorKey(res as any)) {
            toast.error(extractErrorMessage(res as any))
          } else {
            toast.success('Address updated successfully')
          }
        })
        .catch(() => {
          toast.error('An error occured')
        })
    }
    closeAddressModal()
  }

  const handleBankInfoUpdate = (
    values: ISupplierBankInfo,
  ) => {
    if (defaultValues) {
      // const updatedValues = { ...defaultValues, ...values }

      updateSupplier({ id: defaultValues.id, body: values })
        .unwrap()
        .then((res: any) => {
          if (hasErrorKey(res as any)) {
            toast.error(extractErrorMessage(res as any))
          } else {
            toast.success('Bank Info updated successfully')
          }
        })
        .catch(() => {
          toast.error('An error occured')
        })

      // dispatch(updateSupplier(updatedValues))
      // toast.success('Bank Info updated successfully')
    }
    closeBankInfoModal()
  }

  const _handleSubmit = () => {
    trigger().then(() => {
      if (isValid) {
        if (defaultValues) {
          const updatedValues = {
            ...defaultValues,
            ...watch(),
          }

          const _updatedSupplier = Object.entries(
            updatedValues,
          ).reduce(
            (a: any, [k, v]: [string, any]) =>
              v ? ((a[k] = v), a) : a,
            {},
          )

          updateSupplier({
            id: defaultValues.id,
            body: _updatedSupplier,
          })
            .unwrap()
            .then((res: any) => {
              if (hasErrorKey(res as any)) {
                toast.error(extractErrorMessage(res as any))
              } else {
                toast.success(
                  'Supplier updated successfully',
                )
              }
            })
            .catch(() => {
              toast.error('An error occured')
            })
        }

        reset()
      }
    })
  }

  return (
    <>
      <Box>
        {/* <form onSubmit={onSubmit && handleSubmit(onSubmit)}> */}
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
                  readOnly={isView}
                  label='Supplier Name'
                  error={errors.name}
                  placeholder='John Store'
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <ControlledInput
                  name='email'
                  control={control}
                  readOnly={isView}
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
                  readOnly={isView}
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
                  readOnly={isView}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <ControlledInput
                  name='current_credit'
                  control={control}
                  readOnly={isView}
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
                  readOnly={isView}
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
                  readOnly={isView}
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
                  readOnly={isView}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 5 }}>
            <Can I='update' a='supplier'>
              <Button
                variant='contained'
                color='primary'
                onClick={_handleSubmit}
                disabled={isView}
              >
                Save Changes
              </Button>
            </Can>
            <Link href={'/suppliers'}>
              <Button variant='tonal' color='secondary'>
                Cancel
              </Button>
            </Link>
          </Box>
        </Card>
        {/* </form> */}

        <Grid container columns={12} spacing={4}>
          <Grid item md={6} sm={12} xs={12}>
            <Card sx={{ p: 4 }}>
              <AddressInfo
                title='Address'
                actionBtns={
                  <>
                    <Can I='edit' a='supplier'>
                      <IconButton
                        onClick={() =>
                          openAddressModal({
                            addressLine1:
                              watch('address') || '',
                            addressLine2: '',
                            city: getCity(
                              watch('city') || 0,
                            ),
                            country: getCountry(
                              watch('country') || 0,
                            ),
                            postCode: watch('post_code'),
                          })
                        }
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                    </Can>
                  </>
                }
                address={{
                  addressLine: watch('address') || '',
                  addressName: watch('address') || '',
                  city: getCity(watch('city') || 0),
                  country: getCountry(
                    watch('country') || 0,
                  ),
                  postCode: watch('post_code'),
                }}
              />
            </Card>
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <Card sx={{ p: 4 }}>
              <BankInfo
                title='Banking Details'
                bankInfo={{
                  ...watch(),
                  company_number:
                    watch('company_number') || '',
                  vat_number: watch('vat_number') || '',
                  bank_account_name:
                    watch('bank_account_name') || '',
                  account_number:
                    watch('account_number') || '',
                  sort_code: watch('sort_code') || '',
                }}
                actionBtns={
                  <>
                    <Can I='edit' a='supplier'>
                      <IconButton
                        onClick={() =>
                          openBankInfoModal({
                            ...watch(),
                          })
                        }
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                    </Can>
                  </>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <UpdateAddressModal
        open={addressModalStatus()}
        defaultValues={{
          address: defaultValues.address || '',
          city: Number(defaultValues.city) || null,
          country: Number(defaultValues.country) || null,
          post_code: defaultValues.post_code || '',
        }}
        handleClose={closeAddressModal}
        onSubmit={values => handleAddressUpdate(values)}
      />
      <UpdateBankModal
        open={bankInfoModalStatus()}
        defaultValues={{
          account_number: defaultValues.account_number,
          bank_account_name:
            defaultValues.bank_account_name,
          company_number: defaultValues.company_number,
          sort_code: defaultValues.sort_code,
          vat_number: defaultValues.vat_number,
        }}
        handleClose={closeBankInfoModal}
        onSubmit={values => handleBankInfoUpdate(values)}
      />
    </>
  )
}

export default SupplierDetailsTab
