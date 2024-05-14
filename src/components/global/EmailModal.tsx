import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'

import {
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import AppModal from '../global/AppModal'
import ControlledInput from '../global/ControlledInput'
import capitalize from 'src/utils/capitalize'
import { IData } from 'src/utils/types'

interface Props {
  title: string
  open: boolean
  handleClose: () => void
  onSubmit: (values: { email: string }) => void
  data: IData
  from?: 'customer' | 'supplier'
}

const EmailModal = ({
  title,
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
    <AppModal
      open={open}
      handleClose={handleClose}
      title={title}
    >
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        <Box sx={{ mb: 4 }}>
          <Grid container columns={12} spacing={4}>
            {Object.entries(data).map((obj, i) => (
              <Grid item md={6} sm={6} xs={12} key={i}>
                <Typography>{obj[0]}</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {obj[1]}
                </Typography>
              </Grid>
            ))}
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

export default EmailModal
