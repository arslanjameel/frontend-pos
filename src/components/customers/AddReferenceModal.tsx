import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import ControlledInput from '../global/ControlledInput'
import { requiredMsg } from 'src/utils/formUtils'
import AppModal from '../global/AppModal'
import { IReferenceNew } from 'src/models/IReference'
import MaskedInput from '../global/MaskedInput'
import UncontrolledInput from '../global/UncontrolledInput'

const _defaultValues: IReferenceNew = {
  referenceCompanyName: '',
  referenceCompanyNumber: '',
  referenceContactName: '',
  referenceContactNumber: '',
  yearsTrading: 0,
  referenceCreditLimit: '',

  deleted: false,
  customer: [],
}

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: IReferenceNew) => void
}

const AddReferenceModal = ({
  open,
  handleClose,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
    referenceCompanyName: yup
      .string()
      .required(requiredMsg('Company Name')),
    referenceCreditLimit: yup
      .number()
      .required(requiredMsg('Credit Limit')),
    yearsTrading: yup
      .number()
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
    control,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { ..._defaultValues },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={500}
      sx={{ p: 5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Add Reference
        </Typography>
        <Grid container columns={12} spacing={4}>
          <Grid item md={6} sm={6} xs={12}>
            <ControlledInput
              name='referenceCompanyName'
              control={control}
              label='Reference Company Name'
              error={errors.referenceCompanyName}
              placeholder='Company Name'
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ControlledInput
              name='referenceCreditLimit'
              control={control}
              label='Credit Limit'
              error={errors.referenceCreditLimit}
              placeholder='Credit Limit'
              inputType='number'
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <UncontrolledInput
              label='Years Trading'
              error={errors.yearsTrading}
              placeholder='Years Trading'
              maxLength={8}
              value={
                watch('yearsTrading') !== 0
                  ? watch('yearsTrading')
                  : ''
              }
              inputType='number'
              onChange={newVal =>
                setValue('yearsTrading', Number(newVal))
              }
              onBlur={() => trigger('yearsTrading')}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ControlledInput
              name='referenceContactName'
              control={control}
              label='Reference Contact Name'
              error={errors.referenceContactName}
              placeholder='Contact Name'
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
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
              error={errors.referenceContactNumber?.message}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
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
              error={errors.referenceCompanyNumber?.message}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant='contained' type='submit'>
            Add
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default AddReferenceModal
