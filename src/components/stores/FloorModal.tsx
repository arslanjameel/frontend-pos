// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import CustomTextField from 'src/@core/components/mui/text-field'
import AppModal from '../global/AppModal'
import { IWarehouse } from 'src/store/reducers/storesSlice'
import TagsDropdown from '../global/TagsDropdown'

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: IWarehouse
  isEdit?: boolean
  editId?: number | string
  onSubmit?: (values: IFloor) => void
}

interface IFloor {
  id: string
  floorName: string
  sections: number[]
}

interface ISection {
  label: string
  value: number
}

const _defaultValues: IFloor = {
  id: '',
  floorName: '',
  sections: [],
}

const FloorModal = ({
  defaultValues,
  open,
  handleClose,
  isEdit,
  onSubmit,
}: Props) => {
  const [sectionOptions] = useState<ISection[]>([
    { label: 'Section A', value: 1 },
    { label: 'Section B', value: 2 },
    { label: 'Section C', value: 3 },
    { label: 'Section D', value: 4 },
    { label: 'Section E', value: 5 },
  ])

  const schema = yup.object().shape({
    id: yup.string().required(),
    floorName: yup.string().required(),
    sections: yup.array().required(),
  })

  /**
   * Use editId to fetch data on edit mode
   */

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { ..._defaultValues, ...defaultValues },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <AppModal open={open} handleClose={handleClose}>
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        {/* <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        > */}
        <Typography
          id='modal-modal-title'
          sx={{
            mb: 5,
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {isEdit ? 'Edit' : 'Add'} Floor
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Controller
            name='id'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <CustomTextField
                fullWidth
                label='ID'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder='BT521'
                error={Boolean(errors.id)}
                {...(errors.id && {
                  helperText: errors.id.message,
                })}
              />
            )}
          />

          <Controller
            name='floorName'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <CustomTextField
                fullWidth
                label='Floor Name'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder='BB First Floor'
                error={Boolean(errors.floorName)}
                {...(errors.floorName && {
                  helperText: errors.floorName.message,
                })}
              />
            )}
          />
          <TagsDropdown
            label='Section'
            value={watch('sections')}
            onChange={newTags =>
              setValue('sections', newTags)
            }
            options={sectionOptions}
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
            variant='outlined'
            color='primary'
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
        {/* </Card> */}
      </form>
    </AppModal>
  )
}

export default FloorModal
