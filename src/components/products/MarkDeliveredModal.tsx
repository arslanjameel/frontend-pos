import {
  Box,
  Button,
  Slider,
  Typography,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import AppModal from '../global/AppModal'
import { IData } from 'src/utils/types'
import AppSelect from '../global/AppSelect'
import DatePicker from '../global/DatePicker'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: any) => void
  stockData: IData | false
}

const MarkDeliveredModal = ({
  open,
  handleClose,
  onSubmit,
  stockData,
}: Props) => {
  const schema = yup.object().shape({})

  const {
    watch,

    // control,
    getValues,
    setValue,
    handleSubmit,
    formState: {},
  } = useForm({
    values: { ...stockData },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const roundUpToNextTenth = (number: number) =>
    Math.ceil(number / 10) * 10

  const generateSliderLabels = (
    minValue: number,
    maxValue: number,
    numLabels: number,
  ) => {
    if (numLabels < 1) return []

    const interval = (maxValue - minValue) / (numLabels - 1)
    const labels = Array.from(
      { length: numLabels },
      (_, index) => ({
        value: roundUpToNextTenth(
          minValue + index * interval,
        ),
        label: roundUpToNextTenth(
          minValue + index * interval,
        ).toString(),
      }),
    )

    return labels
  }

  const maxSlider = stockData
    ? Math.max(Number(stockData['stock']), 100)
    : 100

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={500}
    >
      <form
        onSubmit={
          onSubmit &&
          handleSubmit((onValid, e) => {
            e?.preventDefault()
            e?.stopPropagation()

            onSubmit(onValid)
          })
        }
      >
        <Typography
          id='modal-modal-title'
          sx={{
            textAlign: 'center',
            mb: 7,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          Mark Delivered
        </Typography>

        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Product Quantity
              </Typography>
              <Typography>
                {watch('stock')} of {maxSlider}
              </Typography>
            </Box>
            <Slider
              aria-label='Custom marks'
              defaultValue={watch('stock')}
              step={10}
              valueLabelDisplay='auto'
              marks={
                stockData &&
                generateSliderLabels(
                  0,
                  stockData['stock'],
                  10,
                )
              }
              max={maxSlider}
              sx={{ width: '92%', mx: '4%' }}
              onChange={(_e, val) => setValue('stock', val)}
            />
          </Box>

          <DatePicker
            label='Delivery Date'
            value={watch('deliveredDate')}
            onChange={newDate =>
              setValue('deliveredDate', newDate)
            }
            placeholder={'Select Delivery Date'}
          />

          <AppSelect
            label='Store'
            placeholder='Store'
            value={watch('store')}
            handleChange={e =>
              setValue('store', e.target.value)
            }
            options={[
              { label: 'Store 1', value: 0 },
              { label: 'Store 2', value: 1 },
              { label: 'Store 3', value: 3 },
            ]}
          />

          <AppSelect
            label='Floor'
            placeholder='Floor'
            value={watch('floor')}
            handleChange={e =>
              setValue('floor', e.target.value)
            }
            options={[
              { label: 'floor 1', value: 0 },
              { label: 'floor 2', value: 1 },
              { label: 'floor 3', value: 3 },
            ]}
          />

          <AppSelect
            label='Section'
            placeholder='Section'
            value={watch('section')}
            handleChange={e =>
              setValue('section', e.target.value)
            }
            options={[
              { label: 'section 1', value: 0 },
              { label: 'section 2', value: 1 },
              { label: 'section 3', value: 3 },
            ]}
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
          <Button variant='tonal' color='secondary'>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => onSubmit(getValues())}
          >
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default MarkDeliveredModal
