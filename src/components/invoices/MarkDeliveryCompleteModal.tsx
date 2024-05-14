import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import AppModal from '../global/AppModal'
import DatePicker from '../global/DatePicker'
import AppSelect from '../global/AppSelect'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppTable from '../global/AppTable'
import { useModal } from 'src/hooks/useModal'
import TableDataModal from '../global/TableDataModal'
import {
  IProductDeliveryMode,
  ProductDeliveryMode,
  deliveryModeOptionsPretty,
} from 'src/models/ISaleInvoice'

interface Props {
  open: boolean
  handleClose: () => void
  products: any[]
  markProductsAsComplete: (params: {
    date: string
    products: any[]
    delivery_mode: IProductDeliveryMode

    trackingNumber?: string
    comments?: string
  }) => void
}

const MarkDeliveryCompleteModal = ({
  open,
  handleClose,
  products,
  markProductsAsComplete,
}: Props) => {
  const getMax = (params: any) => {
    return (
      params.quantity_sold -
      params.quantity_delivered -
      params.products_returned
    )
  }

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<any>()

  const [tempProducts, setTempProducts] = useState<any[]>(
    [],
  )

  useEffect(() => {
    setTempProducts(products || [])
  }, [products, open])

  const [date, setDate] = useState(new Date().toISOString())
  const [deliveryMode, setDeliveryMode] =
    useState<IProductDeliveryMode>('collected')

  const [comments, setComments] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingNumberErr, setTrackingNumberErr] =
    useState('')

  const updateTempProducts = (
    id: number,
    delivered_now: number,
  ) => {
    let temp = [...tempProducts]
    temp = temp.map(t =>
      t.id === id ? { ...t, delivered_now } : t,
    )
    setTempProducts(temp)
  }

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 125,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity_sold',
      headerName: 'TOTAL',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity_delivered',
      headerName: 'DELIVERED',
      type: 'number',
      sortable: false,
      headerAlign: 'center',
      align: 'center',

      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'products_returned',
      headerName: 'RETURNED',
      type: 'number',
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'delivered_now',
      headerName: 'QTY',
      type: 'number',
      minWidth: 100,
      sortable: false,
      headerAlign: 'center',
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Quantity'
          value={params.value}
          InputProps={{
            inputProps: {
              max: getMax(params.row),
              min: 1,
            },
          }}
          type='number'
          sx={{ maxWidth: 100 }}
          onChange={e => {
            const max = getMax(params.row)
            const newVal = Number(e.target.value)

            if (newVal <= max)
              updateTempProducts(params.row.id, newVal)
          }}
        />
      ),
    },
  ]

  const getRightComponent = () => {
    switch (deliveryMode) {
      case ProductDeliveryMode.COLLECTED:
      case ProductDeliveryMode.DELIVERY:
        return (
          <CustomTextField
            label='Comments'
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder='Comments'
            fullWidth
          />
        )
      case ProductDeliveryMode.SUPPLIERDELIVERY:
        return (
          <CustomTextField
            label='Tracking Number'
            value={trackingNumber}
            onChange={e =>
              setTrackingNumber(e.target.value)
            }
            placeholder='Tracking Number'
            fullWidth
            error={Boolean(trackingNumberErr)}
            {...(trackingNumberErr && {
              helperText: trackingNumberErr,
            })}
          />
        )
      default:
        return <></>
    }
  }

  const handleSubmit = () => {
    if (
      deliveryMode === ProductDeliveryMode.SUPPLIERDELIVERY
    ) {
      if (trackingNumber === '') {
        setTrackingNumberErr('Required')

        return
      } else {
        setTrackingNumberErr('')
      }
    }
    markProductsAsComplete({
      products: tempProducts,
      date,
      delivery_mode: deliveryMode,
      comments,
      trackingNumber,
    })
    handleClose()
  }

  return (
    <>
      <AppModal
        maxWidth={750}
        open={open}
        handleClose={handleClose}
        title='Mark as Complete'
        subTitle='Mark products in this invoice as delivered or collected by customer'
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mt: 8,
          }}
        >
          <DatePicker
            label='Date'
            value={date}
            onChange={newDate => setDate(newDate)}
            maxWidth={120}
          />
          <AppSelect
            label='Delivery Method'
            value={deliveryMode}
            options={deliveryModeOptionsPretty}
            handleChange={e =>
              setDeliveryMode(e.target.value)
            }
            sx={{ maxWidth: 190 }}
          />
          <Box sx={{ flex: 1 }}>{getRightComponent()}</Box>
        </Box>

        <Box sx={{ my: 5, border: '1px solid #dcdcdc' }}>
          <AppTable
            columns={columns}
            rows={tempProducts}
            miniColumns={['id', 'sku']}
            openMiniModal={openTableDataModal}
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
            variant='contained'
            color='error'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={tempProducts.length === 0}
          >
            Save
          </Button>
        </Box>
      </AppModal>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.product_name,
                'SKU:': tableData.sku,
                'Total:': tableData.total,
                'Delivered:': tableData.delivered,
                'Quantity:': (
                  <CustomTextField
                    fullWidth
                    placeholder='Quantity'
                    value={
                      tempProducts.find(
                        c => c.id === tableData.id,
                      )?.quantity
                    }
                    InputProps={{
                      inputProps: {
                        max: getMax(tableData),
                        min: 1,
                      },
                    }}
                    type='number'
                    sx={{ maxWidth: 100 }}
                    onChange={e => {
                      const max = getMax(tableData)
                      const newVal = Number(e.target.value)

                      if (newVal <= max)
                        updateTempProducts(
                          tableData.id,
                          newVal,
                        )
                    }}
                  />
                ),
              }
            : {}
        }
      />
    </>
  )
}

export default MarkDeliveryCompleteModal
