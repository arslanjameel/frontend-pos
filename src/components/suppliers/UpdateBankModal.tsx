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
import AppModal from '../global/AppModal'
import MaskedInput from '../global/MaskedInput'
import { ISupplierBankInfo } from 'src/models/ISupplier'

const _defaults: ISupplierBankInfo = {
  account_number: '',
  bank_account_name: '',
  company_number: '',
  sort_code: '',
  vat_number: '',
}

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: ISupplierBankInfo
  onSubmit: (address: ISupplierBankInfo) => void
}

const UpdateBankModal = ({
  open,
  handleClose,
  defaultValues = _defaults,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
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
    values: { ...defaultValues },
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
        Banking Details
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
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
              label='Company Number'
              error={errors.company_number}
              placeholder='37623'
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <ControlledInput
              name='vat_number'
              control={control}
              label='VAT Number'
              error={errors.vat_number}
              placeholder='37623'
            />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='bank_account_name'
              control={control}
              label='Bank Account Name'
              error={errors.bank_account_name}
              placeholder='Bank Name'
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <ControlledInput
              name='account_number'
              control={control}
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
        {/*  */}

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

export default UpdateBankModal
