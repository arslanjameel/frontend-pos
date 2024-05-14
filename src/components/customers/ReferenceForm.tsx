import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import CustomTag from 'src/components/global/CustomTag'
import Icon from 'src/@core/components/icon'
import ControlledInput from '../global/ControlledInput'
import { requiredMsg } from 'src/utils/formUtils'
import ConfirmationModal from '../global/ConfirmationModal'
import { useModal } from 'src/hooks/useModal'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import {
  IReference,
  IReferenceNew,
  IReferenceStatus,
} from 'src/models/IReference'
import {
  useCreateReferenceStatusMutation,
  useDeleteReferenceMutation,
  useGetCustomersQuery,
  useGetReferenceStatusesQuery,
  useUpdateReferenceMutation,
} from 'src/store/apis/customersSlice'
import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import { useAuth } from 'src/hooks/useAuth'
import MaskedInput from '../global/MaskedInput'

const _defaultValues = {
  referenceCompanyName: '',
  referenceCompanyNumber: '',
  referenceContactName: '',
  referenceContactNumber: '',
  yearsTrading: 0,
  referenceCreditLimit: '',

  deleted: false,
}

interface Props {
  title: string
  defaultValues: IReference
}

const ReferenceForm = ({ title, defaultValues }: Props) => {
  const { user } = useAuth()
  const { data: referenceStatuses } =
    useGetReferenceStatusesQuery()
  const { data: customers } = useGetCustomersQuery()

  const [updateReference] = useUpdateReferenceMutation()
  const [deleteReference] = useDeleteReferenceMutation()
  const [createReferenceStatus] =
    useCreateReferenceStatusMutation()

  const getRefStatus = (
    refStatuses?: IPaginatedData<IReferenceStatus>,
  ) => {
    return refStatuses
      ? refStatuses.results.find(
          rs => rs.reference === defaultValues.id,
        )
      : undefined
  }

  const isVerified = () =>
    getRefStatus(referenceStatuses) !== undefined

  const schema = yup.object().shape({
    referenceCompanyName: yup
      .string()
      .required(requiredMsg('Company Name')),
    referenceCreditLimit: yup
      .string()
      .required(requiredMsg('Credit Limit')),
    yearsTrading: yup
      .string()
      .required(requiredMsg('Years Trading')),
    referenceContactName: yup
      .string()
      .required(requiredMsg('Contact Name')),
    referenceContactNumber: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Contact Number')),
    referenceCompanyNumber: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Company Number')),
  })

  const {
    openModal: openVerificationModal,
    closeModal: closeVerificationModal,
    isModalOpen: verificationModalStatus,
  } = useModal<number>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const {
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    values: {
      ..._defaultValues,
      ...defaultValues,
      referenceCreditLimit: Math.round(
        Number(defaultValues.referenceCreditLimit),
      ).toString(),
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const isUpdated = (newValues: IReferenceNew) => {
    const oldValues = defaultValues

    const valuesUpdated =
      newValues.referenceCompanyName !==
        oldValues.referenceCompanyName ||
      Math.fround(
        Number(newValues.referenceCreditLimit),
      ) !==
        Math.fround(
          Number(oldValues.referenceCreditLimit),
        ) ||
      newValues.yearsTrading !== oldValues.yearsTrading ||
      newValues.referenceContactName !==
        oldValues.referenceContactName ||
      newValues.referenceContactNumber !==
        oldValues.referenceContactNumber ||
      newValues.referenceCompanyNumber !==
        oldValues.referenceCompanyNumber

    return valuesUpdated
  }

  const _verifyReference = () => {
    if (user) {
      createReferenceStatus({
        reference: defaultValues.id,
        verificationStatus: 'verified',
        verificationDate: dateToString(
          new Date(),
          'yyyy-MM-dd',
        ),
        verificationDescriptions: '',
        deleted: false,
        verifiedBy: user.id,
      })
        .unwrap()
        .then(() => toast.success('Reference verified'))
        .catch(() => toast.error('An error occured'))
        .finally(() => closeVerificationModal())
    }
  }

  const _updateReference = () => {
    updateReference({
      id: defaultValues.id,
      body: { ...defaultValues, ...watch() },
    })
      .unwrap()
      .then(() =>
        toast.success('Reference updated successfully'),
      )
      .catch(() => toast.error('An error occured'))
      .finally(() => closeDeleteModal())
  }

  const _deleteReference = () => {
    if (deleteModal) {
      deleteReference(deleteModal)
        .unwrap()
        .then(() =>
          toast.success('Reference deleted successfully'),
        )
        .catch(() => toast.error('An error occured'))
        .finally(() => closeDeleteModal())
    }
  }

  const getCustomer = (
    refStatuses?: IPaginatedData<IReferenceStatus>,
  ) => {
    const refStatus = getRefStatus(refStatuses)
    if (customers && refStatus) {
      const customer = customers.results.find(
        c => c.id === refStatus.verifiedBy,
      )
      if (customer)
        return customer.firstName + ' ' + customer.lastName
    }

    return '--'
  }

  return (
    <>
      <Box
        sx={{
          px: 4,
          pb: 5,
          pt: 2,
          borderBottom: '1.5px solid #d6d6d6a9',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Typography variant='h5'>{title}</Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {getRefStatus(referenceStatuses) ? (
              <>
                <CustomTag
                  label='Verified'
                  color='success'
                />
                <Typography>
                  {formatDate(
                    getRefStatus(referenceStatuses)
                      ?.verificationDate || '',
                    'dd MMM yyyy'
                  )}
                </Typography>
                <CustomTag
                  label={`Verified by ${getCustomer(
                    referenceStatuses,
                  )}`}
                  color='info'
                />
              </>
            ) : (
              <Button
                variant='tonal'
                color='warning'
                size='small'
                onClick={() => openVerificationModal(1)}
              >
                Pending Verification
              </Button>
            )}
            {isUpdated(watch()) &&
              !getRefStatus(referenceStatuses) && (
                <Tooltip title='Save' arrow placement='top'>
                  <IconButton
                    color='primary'
                    onClick={_updateReference}
                  >
                    <Icon icon='tabler:device-floppy' />
                  </IconButton>
                </Tooltip>
              )}
            <Tooltip title='Delete' arrow placement='top'>
              <IconButton
                color='error'
                onClick={() =>
                  openDeleteModal(
                    defaultValues ? defaultValues.id : -1,
                  )
                }
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container columns={12} spacing={4}>
          <Grid item md={4} sm={6} xs={12}>
            <ControlledInput
              disabled={isVerified()}
              name='referenceCompanyName'
              control={control}
              label='Reference Company Name'
              error={errors.referenceCompanyName}
              placeholder='Company Name'
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <ControlledInput
              disabled={isVerified()}
              name='referenceCreditLimit'
              control={control}
              label='Credit Limit'
              error={errors.referenceCreditLimit}
              placeholder='Credit Limit'
              inputType='number'
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <ControlledInput
              disabled={isVerified()}
              name='yearsTrading'
              control={control}
              label='Years Trading'
              error={errors.yearsTrading}
              placeholder='Years Trading'
              inputType='number'
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <ControlledInput
              disabled={isVerified()}
              name='referenceContactName'
              control={control}
              label='Reference Contact Name'
              error={errors.referenceContactName}
              placeholder='Contact Name'
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <MaskedInput
              label='Reference Contact Number'
              format='phone'
              value={watch('referenceContactNumber')}
              placeholder='6787 587 3765'
              onChange={newValue =>
                setValue('referenceContactNumber', newValue)
              }
              onBlur={() =>
                trigger('referenceContactNumber')
              }
              disabled={isVerified()}
              error={errors.referenceContactNumber?.message}
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <MaskedInput
              label='Reference Company Number'
              format='phone'
              value={watch('referenceCompanyNumber')}
              placeholder='6787 587 3765'
              onChange={newValue =>
                setValue('referenceCompanyNumber', newValue)
              }
              onBlur={() =>
                trigger('referenceCompanyNumber')
              }
              disabled={isVerified()}
              error={errors.referenceCompanyNumber?.message}
            />
          </Grid>
        </Grid>
      </Box>

      <ConfirmationModal
        open={verificationModalStatus()}
        handleClose={closeVerificationModal}
        title='Verify Reference'
        content='Do you want to mark this reference as verified?'
        confirmTitle='Yes'
        onConfirm={_verifyReference}
        rejectTitle='No'
        onReject={closeVerificationModal}
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        title='Delete Reference'
        content='Are you sure you want to delete this reference?'
        confirmTitle='Delete'
        confirmColor='error'
        onConfirm={_deleteReference}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

export default ReferenceForm
