import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Box, Button, Typography } from '@mui/material'
import AppModal from '../AppModal'
import ControlledInput from '../ControlledInput'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: {
    id: number
    name: string
    description: string
  }) => void
  data: {
    id: number
    name: string
    description: string
  }
}

const SubCategoryModal = ({
  open,
  handleClose,
  onSubmit,
  data,
}: Props) => {
  const schema = yup.object().shape({
    name: yup.string(),
    description: yup.string(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    id: number
    name: string
    description: string
  }>({
    values: {
      id: data.id || 0,
      name: data.name || '',
      description: data.description || '',
    },
    resolver: yupResolver(schema),
  })

  return (
    <AppModal open={open} handleClose={handleClose}>
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
        Sub Category
      </Typography>

      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ControlledInput
          name='name'
          control={control}
          label={`Sub Category Name`}
          error={errors.name}
          placeholder={`Sub Category Name`}
        />
        <ControlledInput
          name='description'
          control={control}
          label='Description'
          error={errors.description}
          placeholder='Type here...'
          multiline
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
        <Button
          disabled={
            watch('name') === '' ||
            watch('description') === ''
          }
          onClick={event => {
            if (handleSubmit) {
              handleSubmit(onSubmit)(event)
            }

            reset({ id: 0, name: '', description: '' })
          }}
          variant='contained'
          type='submit'
        >
          {data.id === 0 ? 'Add' : 'Update'}
        </Button>
      </Box>
    </AppModal>
  )
}

export default SubCategoryModal
