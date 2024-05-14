import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import AppSelect from '../global/AppSelect'
import { useSearchSupplierQuery } from 'src/store/apis/suppliersSlice'
import { IProductSupplier } from 'src/types/IProducts'

interface Props {
  costPerUnit: number
  suppliers: IProductSupplier[]
  setSuppliers: Dispatch<SetStateAction<IProductSupplier[]>>
}

const SupplierCostCard = ({
  costPerUnit,
  suppliers,
  setSuppliers,
}: Props) => {
  const uid = new Date().getTime()
  const { primaryFilled } = UseBgColor()
  const { data: supplierData } = useSearchSupplierQuery('')

  const handleOptions = (options: any) => {
    const data = options.map((option: any) => ({
      label: option.name,
      value: option.id,
    }))

    return data
  }

  const handleChange = (
    idToUpdate: number,
    newValue: number | string,
    ele: string,
  ) => {
    setSuppliers(prev =>
      prev.map(item =>
        item.id === idToUpdate
          ? { ...item, [ele]: newValue }
          : item,
      ),
    )
  }

  return (
    <Card
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 17 }}
        id='supplierCost'
      >
        Supplier & Cost
      </Typography>

      <Box
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <CustomTextField
          label='Current Average Cost Per Unit'
          placeholder='Average Cost Per Unit'
          type='number'
          value={costPerUnit}
          fullWidth
          disabled
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
          <Typography sx={{ flex: 2 }}>
            Supplier*
          </Typography>
          <Typography sx={{ flex: 2 }}>SKU</Typography>
          <Typography sx={{ flex: 1 }}>
            Unit Cost*
          </Typography>
          <Typography sx={{ width: 130 }}>
            Action
          </Typography>
          <Typography sx={{ width: 60 }}></Typography>
        </Box>

        {suppliers.map(e => (
          <Box
            key={e.id}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              my: 2,
            }}
          >
            <Box sx={{ flex: 2, minWidth: 100 }}>
              <AppSelect
                placeholder='Enter Supplier'
                value={e.supplier}
                handleChange={event => {
                  handleChange(
                    e.id,
                    Number(event.target.value),
                    'supplier',
                  )
                }}
                options={
                  supplierData
                    ? handleOptions(supplierData)
                    : []
                }
              />
            </Box>

            <CustomTextField
              fullWidth
              value={e.supplier_sku}
              onChange={event => {
                handleChange(
                  e.id,
                  event.target.value,
                  'supplier_sku',
                )
              }}
              sx={{ flex: 2, minWidth: 100 }}
              placeholder='SKU'
            />

            <CustomTextField
              type='number'
              fullWidth
              label=''
              required
              value={Number(e.supplier_cost).toFixed(2)}
              inputProps={{
                step: '0.01',
              }}
              onChange={event => {
                handleChange(
                  e.id,
                  Number(event.target.value),
                  'supplier_cost',
                )
              }}
              sx={{ flex: 1, minWidth: 100 }}
              placeholder='Cost *'
            />

            {e.default ? (
              <Button
                variant='outlined'
                sx={{ width: 150, mt: 'auto' }}
                disabled
              >
                Default
              </Button>
            ) : (
              <Button
                variant='tonal'
                sx={{ width: 150, mt: 'auto' }}
                onClick={() => {
                  let currentValues = suppliers
                  currentValues = currentValues.map(v => ({
                    ...v,
                    default: e.id === v.id,
                  }))
                  setSuppliers(currentValues)
                }}
              >
                Set As Default
              </Button>
            )}

            <IconButton
              color='primary'
              sx={{
                mt: 'auto',
                ...primaryFilled,
                borderRadius: '9px !important',
                '&:hover': { ...primaryFilled },
              }}
              onClick={() =>
                setSuppliers(
                  suppliers.filter(v => v.id !== e.id),
                )
              }
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box>
        <IconButton
          color='primary'
          sx={{
            border: `1.5px solid #ddd`,
            borderRadius: '9px !important',
          }}
          onClick={() => {
            setSuppliers([
              ...suppliers,
              {
                id: uid,
                supplier_cost: '',
                supplier_sku: '',
                default: false,
                supplier: 0,
              },
            ])
          }}
        >
          <Icon icon='tabler:plus' />
        </IconButton>
      </Box>
    </Card>
  )
}

export default SupplierCostCard
