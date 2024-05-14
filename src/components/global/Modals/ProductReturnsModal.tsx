import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import AppModal from '../AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppTable from '../AppTable'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  handleClose: () => void
  products?: any[]
  onSubmit: (products: any[]) => any

  // costData: IData[]
  // markProductsAsComplete: (products: IData[]) => void
}

const ProductReturnsModal = ({
  products = [],
  handleClose,
  open,
  onSubmit,
}: Props) => {
  const [productsTemp, setProductsTemp] = useState<any[]>(
    [],
  )

  useEffect(() => {
    setProductsTemp(products)
  }, [products])

  const updateDataTemp = (
    id: number,
    key: 'quantity_delivered' | 'quantity_pending',
    value: any,
  ) => {
    let temp = [...productsTemp]

    if (key === 'quantity_delivered') {
      temp = temp.map(t =>
        t.id === id
          ? t.quantity >= value
            ? {
                ...t,
                quantity_delivered: value,
                quantity_pending: t.quantity - value,
              }
            : t
          : t,
      )
    } else {
      temp = temp.map(t =>
        t.id === id
          ? t.quantity >= value
            ? {
                ...t,
                quantity_pending: value,
                quantity_delivered: t.quantity - value,
              }
            : t
          : t,
      )
    }

    setProductsTemp(temp)
  }

  const handleSubmit = () => {
    const hasWrongAddUps = productsTemp.some(
      prod =>
        prod.quantity_pending + prod.quantity_delivered >
        prod.quantity,
    )

    if (hasWrongAddUps) {
      toast.error(
        'Pending and Delivered quantities should add up to the "To Return" value',
      )
    } else {
      onSubmit(productsTemp)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 130,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <Box width={'100%'}>
          <Typography>{params.row.product_name}</Typography>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },

    {
      field: 'quantity_delivered',
      headerName: 'DELIVERED',
      type: 'number',
      minWidth: 100,
      maxWidth: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Quantity Delivered'
          value={params.value}
          InputProps={{
            inputProps: {
              max: params.row.max_delivered,
              min: 0,
            },
          }}
          type='number'
          sx={{ maxWidth: 100 }}
          onChange={e =>
            updateDataTemp(
              params.row.id,
              'quantity_delivered',
              Number(e.target.value),
            )
          }
        />
      ),
    },

    {
      field: 'quantity_pending',
      headerName: 'PENDING',
      type: 'number',
      minWidth: 100,
      maxWidth: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Quantity'
          value={params.value}
          InputProps={{
            inputProps: {
              max:
                params.row.quantity -
                params.row.max_delivered,
              min: 0,
            },
          }}
          type='number'
          sx={{ maxWidth: 100 }}
          onChange={e =>
            updateDataTemp(
              params.row.id,
              'quantity_pending',
              Number(e.target.value),
            )
          }
        />
      ),
    },
    {
      field: 'quantity',
      headerName: 'TO RETURN',
      type: 'number',
      minWidth: 100,
      maxWidth: 130,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
  ]

  return (
    <AppModal
      maxWidth={630}
      open={open}
      handleClose={handleClose}
      title='Product Returns'
      subTitle='Select which items are being returned'
    >
      <Box>
        <Box sx={{ my: 5, border: '1px solid #dcdcdc' }}>
          <AppTable
            columns={columns}
            rows={(productsTemp || []).filter(
              prod => prod.max_delivered > 0,
            )}
            miniColumns={['id', 'sku']}
            showToolbar={false}
            showSearch={false}
            showPageSizes={false}
            pagination={false}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
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
            variant='contained'
            onClick={handleSubmit}
            disabled={productsTemp.length === 0}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}

export default ProductReturnsModal
