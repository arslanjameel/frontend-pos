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

import { requiredMsg } from 'src/utils/formUtils'
import ControlledInput from '../ControlledInput'
import ManagerApprovalModal from './ManagerApprovalModal'
import UncontrolledInput from '../UncontrolledInput'
import { useGetBrandsQuery } from 'src/store/apis/productsSlice'
import { useAuth } from 'src/hooks/useAuth'
import { useAppSelector } from 'src/store/hooks'
import { useModal } from 'src/hooks/useModal'
import AppModal from '../AppModal'
import AppSelect from '../AppSelect'

interface ITemporaryProduct {
  brandName: string
  sku: string
  productName: string
  price: number
  cost: number
}

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: any) => void
}

const AddTemporaryProductModal = ({
  open,
  handleClose,
  onSubmit,
}: Props) => {
  const { store } = useAppSelector(state => state.app)
  const { user } = useAuth()
  const { data: brands } = useGetBrandsQuery()

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const schema = yup.object().shape({
    brandName: yup
      .string()
      .required(requiredMsg('Brand Name')),
    sku: yup.string().required(requiredMsg('SKU')),
    productName: yup
      .string()
      .required(requiredMsg('Product Name')),
    price: yup.string().required(requiredMsg('Price')),
    cost: yup.string().required(requiredMsg('Cost')),
  })

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ITemporaryProduct>({
    values: {
      brandName: '',
      cost: 0,
      price: 0,
      productName: '',
      sku: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const handleSubmit = () => {
    const obj = {
      product_price: [
        {
          price_a: Number(watch('price')),
          price_b: Number(watch('price')),
          price_c: Number(watch('price')),
          unit_cost: Number(watch('cost')),
          average_unit_cost: Number(watch('cost')),
          is_active: false,
        },
      ],
      product_stock: [
        {
          quantity: 0,
          store: store?.id,
          supplier_stock: [
            {
              floor: '',
              section: '',
              supplier_cost: Number(watch('cost')),
              quantity: 0,
              supplier: null,
            },
          ],
        },
      ],
      product_supplier: [],
      product_name: watch('productName'),
      sku: watch('sku'),
      alternate_sku: '',
      descriptions: 'Temporary Product',
      product_status: 'published',
      image_url: null,
      barcode: null,
      brand: watch('brandName'),
      category: [],
      sub_category: null,
      is_temporary_product: true,
      is_active: true,
      created_by: user?.id,
      merged_record: null,
      published_by: user?.id,
      tag: [],
      related_products: [],
      created_from_store: store?.id,
    }
    onSubmit(obj)
    reset()
  }

  const handleBrandsOptions = (options: any) => {
    const data = options.map((option: any) => ({
      label: option.name,
      value: option.id,
    }))

    return data
  }

  return (
    <>
      <AppModal
        open={open}
        handleClose={handleClose}
        sx={{ p: 6 }}
        title='Add Temporary Product'
        titleAlign='left'
        maxWidth={500}
      >
        <Box sx={{ mb: 4 }}>
          <Grid container columns={12} spacing={4}>
            <Grid item md={12} sm={12} xs={12}>
              <AppSelect
                label='Brand'
                options={
                  brands ? handleBrandsOptions(brands) : []
                }
                value={watch('brandName')}
                handleChange={e =>
                  setValue('brandName', e.target.value)
                }
              />

              <Typography
                variant='subtitle2'
                sx={{ opacity: 0.5 }}
              >
                Product brand name
              </Typography>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='sku'
                control={control}
                label='Product SKU'
                error={errors.sku}
                placeholder='WSIWJID'
              />
              <Typography
                variant='subtitle2'
                sx={{ opacity: 0.5 }}
              >
                Product brand name
              </Typography>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='productName'
                control={control}
                label='Product Name'
                error={errors.productName}
                placeholder='Product Name'
              />
              <Typography
                variant='subtitle2'
                sx={{ opacity: 0.5 }}
              >
                A product name is required and recommended
                to be unique
              </Typography>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <UncontrolledInput
                label='Price'
                value={
                  watch('price').toString() === '0'
                    ? ''
                    : watch('price')
                }
                onChange={newVal =>
                  setValue('price', Number(newVal))
                }
                onBlur={() => trigger('price')}
                error={errors.price}
                placeholder='Price'
                inputType='number'
              />
              <Typography
                variant='subtitle2'
                sx={{ opacity: 0.5 }}
              >
                A product price is required
              </Typography>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <UncontrolledInput
                label='Cost'
                value={
                  watch('cost').toString() === '0'
                    ? ''
                    : watch('cost')
                }
                onChange={newVal =>
                  setValue('cost', Number(newVal))
                }
                onBlur={() => trigger('cost')}
                error={errors.cost}
                placeholder='Cost'
                inputType='number'
              />
            </Grid>
          </Grid>
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
          <Button variant='contained' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={openManagerApprovalModal}
          >
            Request Manager Approval
          </Button>
        </Box>
      </AppModal>
      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={handleSubmit}
      />
    </>
  )
}

export default AddTemporaryProductModal
