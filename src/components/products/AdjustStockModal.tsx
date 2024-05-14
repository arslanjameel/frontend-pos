import {
  Box,
  Button,

  // IconButton,
  Typography,
} from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// import Icon from 'src/@core/components/icon'
import ControlledInput from '../global/ControlledInput'
import { requiredMsg } from 'src/utils/formUtils'
import AppModal from '../global/AppModal'

// import IStockInfo from 'src/types/IStoreInfo'
// import DatePicker from '../global/DatePicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSelect from '../global/AppSelect'
import { dateToString } from 'src/utils/dateUtils'

// const _defaults: IStockInfo = {
//   deliveryStore: '',
//   supplierName: '',
//   quantity: 0,
//   unitCost: 0,
//   expectedDeliveryDate: '',
//   floor: '',
//   section: '',
//   sameAsCurrentStock: false
// }

// interface ICurrentStock {
//   id?: number
//   quantity: number
//   store: string
//   floor: string
//   section: string
// }

// const currStock: ICurrentStock = { id: 1, quantity: 0, store: '', floor: '', section: '' }
interface IPendingStock {
  id?: number
  quantity: number
  manufacturer?: string
  expectedDate?: string
  unit_cost: number
  purchase_order_no: string
  expected_delivery_date: string
}
type IPendingOptions =
  | 'id'
  | 'quantity'
  | 'manufacturer'
  | 'expectedDate'
  | 'unit_cost'
  | 'purchase_order_no'
  | 'expected_delivery_date'
const pendingStock: IPendingStock = {
  id: 1,
  quantity: 0,
  unit_cost: 0,
  expectedDate: '',
  purchase_order_no: '',
  expected_delivery_date: '',
}

interface IDefault {
  quantity1: number
  quantity2: number

  store1: string
  store2: string

  floor1: string
  floor2: string

  section1: string
  section2: string

  pendingStocks: IPendingStock[]
}
const _defaults: IDefault = {
  quantity1: 0,
  quantity2: 0,

  store1: '',
  store2: '',

  floor1: '',
  floor2: '',

  section1: '',
  section2: '',

  pendingStocks: [pendingStock],
}

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: IDefault
  onSubmit: (data: IDefault) => void
}

const AdjustStockModal = ({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: Props) => {
  const schema = yup.object().shape({
    quantity1: yup
      .number()
      .required(requiredMsg('Quantity')),
    quantity2: yup
      .number()
      .required(requiredMsg('Quantity')),

    store1: yup.string().required(requiredMsg('Store')),
    store2: yup.string().required(requiredMsg('Store')),

    floor1: yup.string().required(requiredMsg('Floor')),
    floor2: yup.string().required(requiredMsg('Floor')),

    section1: yup.string().required(requiredMsg('Section')),
    section2: yup.string().required(requiredMsg('Section')),

    pendingStocks: yup.array().optional(),
  })

  const {
    watch,
    setValue,
    trigger,

    control,

    // handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    values: { ..._defaults, ...defaultValues },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const _handleSubmit = () => {
    trigger().then(() => {
      if (isValid) {
        onSubmit(watch())
        reset()
      }
    })
  }

  const updatePendingArr = (
    id: number,
    key: IPendingOptions,
    value: any,
  ) => {
    const details = watch('pendingStocks')

    const currVal = details.filter(d => d.id === id)

    if (currVal.length > 0) {
      const temp = details.map(d =>
        d.id === id ? { ...currVal[0], [key]: value } : d,
      )
      setValue('pendingStocks', temp)
    } else {
      const newVal: IPendingStock = {
        id: Date.now(),
        quantity: 0,
        expected_delivery_date: dateToString(new Date()),
        purchase_order_no: '',
        unit_cost: 0,
      }
      setValue('pendingStocks', [...details, newVal])
    }
  }

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={600}
      sx={{ p: 6 }}
    >
      <Typography
        variant='h4'
        fontWeight={600}
        marginBottom={5}
        textAlign='center'
      >
        Adjust Stock
      </Typography>

      {/*
       *
       * Current Stock
       *
       */}

      <Typography
        sx={{
          fontWeight: 600,
          mb: 3,
          borderTop: '1px solid #ddd',
          mt: 5,
          pt: 3,
        }}
      >
        Current Stock
      </Typography>
      <Box
        sx={{
          display: 'flex',
          mt: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ width: 80 }}>
          <ControlledInput
            name='quantity1'
            control={control}
            label='Quantity'
            error={errors.quantity1}
            placeholder='23'
            inputType='number'
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Store'
            placeholder='Store'
            value={watch('store1')}
            handleChange={e =>
              setValue('store1', e.target.value)
            }
            options={[
              { label: 'Store 1', value: 0 },
              { label: 'Store 2', value: 1 },
              { label: 'Store 3', value: 3 },
            ]}
            error={errors.store1?.message}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Floor'
            placeholder='Floor'
            value={watch('floor1')}
            handleChange={e =>
              setValue('floor1', e.target.value)
            }
            options={[
              { label: 'floor 1', value: 0 },
              { label: 'floor 2', value: 1 },
              { label: 'floor 3', value: 3 },
            ]}
            error={errors.floor1?.message}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Section'
            placeholder='Section'
            value={watch('section1')}
            handleChange={e =>
              setValue('section1', e.target.value)
            }
            options={[
              { label: 'section 1', value: 0 },
              { label: 'section 2', value: 1 },
              { label: 'section 3', value: 3 },
            ]}
            error={errors.section1?.message}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          mt: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ width: 80 }}>
          <ControlledInput
            name='quantity2'
            control={control}
            label='Quantity'
            error={errors.quantity2}
            placeholder='23'
            inputType='number'
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Store'
            placeholder='Store'
            value={watch('store2')}
            handleChange={e =>
              setValue('store2', e.target.value)
            }
            options={[
              { label: 'Store 1', value: 0 },
              { label: 'Store 2', value: 1 },
              { label: 'Store 3', value: 3 },
            ]}
            error={errors.store2?.message}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Floor'
            placeholder='Floor'
            value={watch('floor2')}
            handleChange={e =>
              setValue('floor2', e.target.value)
            }
            options={[
              { label: 'floor 1', value: 0 },
              { label: 'floor 2', value: 1 },
              { label: 'floor 3', value: 3 },
            ]}
            error={errors.floor2?.message}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 80 }}>
          <AppSelect
            label='Section'
            placeholder='Section'
            value={watch('section2')}
            handleChange={e =>
              setValue('section2', e.target.value)
            }
            options={[
              { label: 'section 1', value: 0 },
              { label: 'section 2', value: 1 },
              { label: 'section 3', value: 3 },
            ]}
            error={errors.section2?.message}
          />
        </Box>
      </Box>

      {/*
       *
       * Pending Stock
       *
       */}

      <Typography
        sx={{
          fontWeight: 600,
          mb: 3,
          borderTop: '1px solid #ddd',
          mt: 5,
          pt: 3,
        }}
      >
        Pending Stock
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {watch('pendingStocks').map((value, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ width: 80 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Quantity'
                placeholder='12'
                value={value.quantity}
                onChange={e =>
                  updatePendingArr(
                    value.id || i,
                    'quantity',
                    e.target.value,
                  )
                }
              />
            </Box>

            <Box sx={{ width: 80 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Unit cost'
                placeholder='12'
                value={value.unit_cost}
                onChange={e =>
                  updatePendingArr(
                    value.id || i,
                    'unit_cost',
                    e.target.value,
                  )
                }
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 80 }}>
              <CustomTextField
                fullWidth
                label='Purchase Order No'
                placeholder='Purchase Order No'
                value={value.manufacturer}
                onChange={e =>
                  updatePendingArr(
                    value.id || i,
                    'purchase_order_no',
                    e.target.value,
                  )
                }
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 80 }}>
              <CustomTextField
                fullWidth
                label='Expected Delivery Date'
                placeholder='Expected Delivery Date'
                value={value.expected_delivery_date}
                onChange={e =>
                  updatePendingArr(
                    value.id || i,
                    'expected_delivery_date',
                    e.target.value,
                  )
                }
              />
            </Box>

            {/* <Box sx={{ flex: 1, minWidth: 80 }}>
              <CustomTextField
                fullWidth
                label='Manufacturer'
                placeholder='Manufacturer'
                value={value.manufacturer}
                onChange={e =>
                  updatePendingArr(
                    value.id || i,
                    'manufacturer',
                    e.target.value,
                  )
                }
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 80 }}>
              <DatePicker
                label='Expected Delivery Date'
                value={value.expectedDate}
                onChange={newDate =>
                  updatePendingArr(
                    value.id || i,
                    'expectedDate',
                    newDate,
                  )
                }
                placeholder={'Select Delivery Date'}
              />
            </Box> */}
          </Box>
        ))}
      </Box>

      {/* <Box sx={{ mt: 2 }}>
        <IconButton
          color='primary'
          sx={{
            border: `1.5px solid #ddd`,
            borderRadius: '9px !important',
          }}
          onClick={() => {
            setValue('pendingStocks', [
              ...watch('pendingStocks'),
              {
                id: Date.now(),
                quantity: 0,
                manufacturer: '',
                expectedDate: '',
              },
            ])
          }}
        >
          <Icon icon='tabler:plus' />
        </IconButton>
      </Box> */}

      {/*
       *
       * Actions
       *
       */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          borderTop: '1px solid #ddd',
          mt: 5,
          pt: 3,
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={_handleSubmit}
        >
          Save
        </Button>
      </Box>
    </AppModal>
  )
}

export default AdjustStockModal
