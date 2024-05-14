import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import AppModal from '../global/AppModal'
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import ControlledInput from '../global/ControlledInput'
import capitalize from 'src/utils/capitalize'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: { email: string }) => void
  data: {
    customerName: string
    documentId: string
    documentType: string
    documentDate: string
    email?: string
  }
  from?: 'customer' | 'supplier'
}

const EmailCustomerModal = ({
  open,
  handleClose,
  onSubmit,
  data,
  from = 'customer',
}: Props) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(emailInvalidErr())
      .required(requiredMsg('Email')),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    values: { email: data.email || '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <AppModal open={open} handleClose={handleClose}>
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        <Typography
          id='modal-modal-title'
          variant='h4'
          sx={{
            p: 4,
            px: 6,
            textAlign: 'center',
            mb: 5,
            fontWeight: 600,
          }}
        >
          Email {capitalize(from)}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container columns={12} spacing={4}>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>
                {capitalize(from)} Name
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {data.customerName}
              </Typography>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Typography>Document ID</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {data.documentId}
              </Typography>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Typography>Document Type</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {data.documentType}
              </Typography>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Typography>Document Date</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {data.documentDate}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <ControlledInput
          inputType='email'
          name='email'
          control={control}
          label={`${capitalize(from)} Email`}
          error={errors.email}
          placeholder={`Default ${capitalize(
            from,
          )} email address`}
        />

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
            Send
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

export default EmailCustomerModal
