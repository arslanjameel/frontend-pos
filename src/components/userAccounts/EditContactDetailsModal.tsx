import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import AppModal from '../global/AppModal'
import ControlledInput from '../global/ControlledInput'

interface IContact {
  mobile: string
  email: string
}

interface Props {
  open: boolean
  defaultValues: IContact
  handleClose: () => void
  onSubmit: (values: IContact) => void
}

const EditContactDetailsModal = ({
  open,
  defaultValues,
  handleClose,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
    mobile: yup.string().required(),
    email: yup.string().required(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <AppModal open={open} handleClose={handleClose}>
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        <Typography
          id='modal-modal-title'
          sx={{ mb: 5, fontSize: 18, fontWeight: 700 }}
        >
          Edit Contact Details
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <ControlledInput
            name='mobile'
            control={control}
            label='Phone'
            error={errors.mobile}
            placeholder='027162723'
            inputType='tel'
            maxLength={11}
          />

          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <CustomTextField
                fullWidth
                label='Email'
                type='email'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder='john.doe@gmail.com'
                error={Boolean(errors.email)}
                {...(errors.email && {
                  helperText: errors.email.message,
                })}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default EditContactDetailsModal
