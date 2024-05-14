import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import 'flatpickr/dist/themes/light.css'
import AppModal from '../global/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSelect from '../global/AppSelect'
import { IProductStock } from 'src/types/IProducts'
import { useSearchSupplierQuery } from 'src/store/apis/suppliersSlice'
import { useGetStoresQuery } from 'src/store/apis/accountSlice'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (address: IProductStock) => void
}

const StockFormModal = ({
  open,
  handleClose,
  onSubmit,
}: Props) => {
  const uid = new Date().getTime()
  const { data: stores } = useGetStoresQuery()
  const { data: suppliers } = useSearchSupplierQuery('')
  const [stock, setStock] = useState<IProductStock>({
    id: uid,
    quantity: 0,
    store: 0,
    floor: '',
    section: '',
    supplier: 0,
    unit_cost: 0,
    delivery_date: null,
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
        Add Stock
      </Typography>

      <Grid
        container
        columns={6}
        sm={12}
        xs={12}
        spacing={4}
      >
        <Grid item md={3} sm={6} xs={6}>
          <AppSelect
            label='Store'
            options={(stores?.results || []).map(
              (store: any) => ({
                label: store.name,
                value: store.id,
              }),
            )}
            value={stock.store}
            handleChange={val => {
              const filter = { ...stock }
              filter.store = val.target.value
              setStock(filter)
            }}
          />
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <AppSelect
            label='Supplier'
            options={(suppliers || []).map(
              (store: any) => ({
                label: store.name,
                value: store.id,
              }),
            )}
            value={stock.supplier}
            handleChange={val => {
              const filter = { ...stock }
              filter.supplier = val.target.value
              setStock(filter)
            }}
          />
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <CustomTextField
            label='Quantity'
            fullWidth
            placeholder='QTY'
            type='number'
            onChange={val => {
              const filter = { ...stock }
              filter.quantity = Number(val.target.value)
              setStock(filter)
            }}
          />
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <CustomTextField
            label='Unit Cost'
            fullWidth
            placeholder='Unit Cost'
            type='number'
            inputProps={{
              step: '0.01',
            }}
            onChange={val => {
              const filter = { ...stock }
              filter.unit_cost = Number(val.target.value)
              setStock(filter)
            }}
          />
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <CustomTextField
            label='Floor'
            fullWidth
            placeholder='Floor'
            value={stock.floor}
            onChange={val => {
              const filter = { ...stock }
              filter.floor = val.target.value
              setStock(filter)
            }}
          />
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <CustomTextField
            label='Section'
            fullWidth
            placeholder='Section'
            value={stock.section}
            onChange={val => {
              const filter = { ...stock }
              filter.section = val.target.value
              setStock(filter)
            }}
          />
        </Grid>
      </Grid>
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
          onClick={() => {
            onSubmit(stock)
            setStock({
              id: uid,
              quantity: 0,
              store: 0,
              floor: '',
              section: '',
              supplier: 0,
              unit_cost: 0,
              delivery_date: null,
            })
            handleClose()
          }}
          variant='contained'
          color='primary'
          type='submit'
        >
          Add
        </Button>
      </Box>
    </AppModal>
  )
}

export default StockFormModal
