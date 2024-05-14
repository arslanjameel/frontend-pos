import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import AppModal from '../global/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppTable from '../global/AppTable'
import { IData } from 'src/utils/types'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { useModal } from 'src/hooks/useModal'
import TableDataModal from '../global/TableDataModal'
import { getFullName } from 'src/utils/dataUtils'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { formatDate } from 'src/utils/dateUtils'
import { requiredMsg } from 'src/utils/formUtils'
import ControlledInput from '../global/ControlledInput'
import { ICustomer } from 'src/models/ICustomer'
import CurrentStoreName from '../global/CurrentStoreName'
import CurrentStoreAddress from '../global/CurrentStoreAddress'

interface Props {
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  orderInfo?: any
  open: boolean
  handleClose: () => void
  onSubmit?: (submittedData: {
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
    productsInfo: IData[]
  }) => void
  products: IData[]
}

const CreateDeliveryNoteModal = ({
  customerInfo,
  invoiceInfo,
  orderInfo,
  open,
  handleClose,
  onSubmit,
  products,
}: Props) => {
  const schema = yup.object().shape({
    customerName: yup
      .string()
      .required(requiredMsg('Customer Name')),
    customerRef: yup.string().optional(),
    customerDeliveryAddress: yup.string().optional(),
  })

  const checkOrderInvoiceAddress = () => {
    if (invoiceInfo) {
      return invoiceInfo?.deliver_to
        ? invoiceInfo?.deliver_to || ''
        : ''
    } else if (orderInfo) {
      return orderInfo?.deliver_to
        ? orderInfo?.deliver_to || ''
        : ''
    } else {
      return ''
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      customerName: customerInfo
        ? getFullName(customerInfo)
        : '',
      customerRef:
        invoiceInfo?.invoice_reference ||
        orderInfo?.order_reference ||
        '',
      customerDeliveryAddress: checkOrderInvoiceAddress(),
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const { isMobileSize } = useWindowSize()
  const [dataTemp, setDataTemp] = useState<IData[]>([])

  useEffect(() => {
    setDataTemp([...products])
  }, [products, open])

  const updateDataTemp = (
    id: number,
    deliverNow: number,
  ) => {
    let temp = [...dataTemp]
    temp = temp.map(t =>
      t.id === id ? { ...t, deliverNow } : t,
    )
    setDataTemp(temp)
  }

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
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
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity_delivered',
      headerName: 'DELIVERED',
      type: 'number',
      minWidth: 100,
      headerAlign: 'center',
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'deliverNow',
      headerName: 'DELIVER NOW',
      type: 'number',
      minWidth: 100,
      headerAlign: 'center',
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Deliver Now'
          value={params.value || 0}
          type='number'
          sx={{ maxWidth: 90 }}
          onChange={(e: any) => {
            if (
              Number(e.target.value) >=
              Number(params.row.quantity_sold) -
                Number(params.row.quantity_delivered)
            ) {
              updateDataTemp(
                params.row.id,
                Number(params.row.quantity_sold) -
                  Number(params.row.quantity_delivered),
              )
            } else if (Number(e.target.value) < 0) {
              updateDataTemp(
                params.row.id,
                Math.min(
                  Number(params.row.quantity_sold) -
                    Number(params.row.quantity_delivered),
                  1,
                ),
              )
            } else {
              updateDataTemp(
                params.row.id,
                Number(e.target.value),
              )
            }
          }}
        />
      ),
    },
  ]

  const _handleSubmit = (values: {
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
  }) => {
    onSubmit &&
      onSubmit({
        customerName: values.customerName,
        customerRef: values.customerRef,
        customerDeliveryAddress:
          values.customerDeliveryAddress,
        productsInfo: dataTemp,
      })
    handleClose()
  }

  return (
    <>
      <AppModal
        maxWidth={800}
        open={open}
        handleClose={handleClose}
        sx={{ px: isMobileSize ? 4 : 7 }}
      >
        <form
          onSubmit={
            onSubmit
              ? handleSubmit(_handleSubmit)
              : undefined
          }
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexWrap: 'wrap',
              rowGap: 5,
              justifyContent: 'space-between',
              px: isMobileSize ? 0 : 4,
            }}
          >
            <Box sx={{ maxWidth: 230 }}>
              <CurrentStoreName />
              <CurrentStoreAddress />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                maxWidth: 300,
              }}
            >
              <Typography variant='h3'>
                {invoiceInfo
                  ? `Invoice ${invoiceInfo.invoice_number}`
                  : orderInfo
                  ? `Order ${orderInfo.order_number}`
                  : '--'}
              </Typography>

              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ minWidth: 110 }}>
                  Date Issued:
                </Typography>
                <Typography fontWeight={600}>
                  {invoiceInfo
                    ? formatDate(
                        invoiceInfo?.created_at || '',
                        'dd/MM/yyyy',
                      )
                    : orderInfo
                    ? formatDate(
                        orderInfo?.created_at || '',
                        'dd/MM/yyyy',
                      )
                    : '--'}
                </Typography>
              </Box>
              {/* <Box sx={{ display: 'flex' }}>
                <Typography sx={{ minWidth: 110 }}>
                  Time:
                </Typography>
                <Typography fontWeight={600}>
                  {invoiceInfo
                    ? formatDate(
                        invoiceInfo?.created_at || '',
                        'HH:mm',
                      )
                    : orderInfo
                    ? formatDate(
                        orderInfo?.created_at || '',
                        'HH:mm',
                      )
                    : '--'}
                </Typography>
              </Box> */}

              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ minWidth: 110 }}>
                  {invoiceInfo
                    ? `Invoice No:`
                    : orderInfo
                    ? `Order No:`
                    : '--'}
                </Typography>
                <Typography fontWeight={600}>
                  {invoiceInfo
                    ? `Invoice ${invoiceInfo?.invoice_number}`
                    : orderInfo
                    ? `Order ${orderInfo.order_number}`
                    : '--'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ minWidth: 110 }}>
                  Customer No:
                </Typography>
                <Typography fontWeight={600}>
                  {customerInfo?.id || '--'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 8,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              px: isMobileSize ? 0 : 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ minWidth: 150 }}>
                  Customer Name
                </Typography>
                <ControlledInput
                  name='customerName'
                  control={control}
                  label=''
                  sx={{ minWidth: 120, maxWidth: 140 }}
                  error={errors.customerName}
                  placeholder='John'
                  capitalizeValue
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ minWidth: 150 }}>
                  Customer Reference
                </Typography>
                <ControlledInput
                  name='customerRef'
                  control={control}
                  label=''
                  sx={{ maxWidth: 140 }}
                  error={errors.customerRef}
                  placeholder='Frankie'
                  capitalizeValue
                />
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                maxWidth: isMobileSize ? 'initial' : 300,
                mt: 2,
              }}
            >
              <Typography>Delivery Address:</Typography>
              <ControlledInput
                name='customerDeliveryAddress'
                control={control}
                label=''
                error={errors.customerDeliveryAddress}
                placeholder='Customer Address'
                capitalizeValue
                multiline
                minRows={3}
              />
            </Box>
          </Box>

          <Box sx={{ border: '1px solid #ddd', mt: 6 }}>
            <AppTable
              columns={columns}
              rows={dataTemp}
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
              mt: 4,
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
              type='submit'
              variant='contained'
              disabled={dataTemp.length === 0}
            >
              Save
            </Button>
          </Box>
        </form>
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
                'Deliver Now:': (
                  <CustomTextField
                    fullWidth
                    placeholder='Deliver Now'
                    value={
                      dataTemp.find(
                        c => c.id === tableData.id,
                      )?.deliverNow
                    }
                    type='number'
                    sx={{ maxWidth: 90 }}
                    onChange={e =>
                      updateDataTemp(
                        tableData.id,
                        Number(e.target.value),
                      )
                    }
                  />
                ),
              }
            : {}
        }
      />
    </>
  )
}

export default CreateDeliveryNoteModal
