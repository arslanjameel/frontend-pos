import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Box, Button } from '@mui/material'

import AppModal from './AppModal'
import ControlledInput from './ControlledInput'

interface FormData {
  product_note: string
}

interface Props {
  defaultValues?: FormData
  open: boolean
  handleClose: () => void
  onSubmit: (values: FormData) => void
}

const InternalNotesModal = ({
  defaultValues = { product_note: '' },
  open,
  onSubmit,
  handleClose,
}: Props) => {
  const schema = yup.object().shape({
    product_note: yup.string().optional(),
  })

  const {
    control,
    trigger,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    values: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const handleSubmit = () => {
    trigger().then(() => {
      if (isValid) {
        onSubmit(watch())
        reset({})
      }
    })
  }

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      sx={{ p: 3 }}
      title='Internal Notes'
      titleAlign='left'
      maxWidth={300}
    >
      <ControlledInput
        name='product_note'
        control={control}
        label='Internal Notes'
        error={errors.product_note}
        placeholder='Notes...'
        minRows={4}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          variant='contained'
          onClick={handleSubmit}
          sx={{ marginTop: 4 }}
        >
          Save
        </Button>
      </Box>
    </AppModal>
  )
}

export default InternalNotesModal
